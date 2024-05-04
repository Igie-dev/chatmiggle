import prisma from "../../lib/prisma.js";
import { v4 as uuid } from "uuid";
const removeFromGroup = ({ channel_id, user_id, type }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const foundChannel = await prisma.channel.findUnique({
        where: { channel_id },
        include: {
          members: {
            where: {
              is_deleted: false,
            },
          },
        },
      });

      if (!foundChannel?.id) {
        return reject({ error: "Channel not found" });
      }

      const foundUser = await prisma.user.findUnique({ where: { user_id } });
      if (!foundUser?.id) {
        return reject({ error: "User not found" });
      }

      //If channel has no member
      //Delete tha channel
      if (foundChannel?.members?.length <= 0) {
        await prisma.channel.delete({ where: { channel_id } });
        return resolve({ data: { user_id, channel_id } });
      }

      for await (const member of foundChannel?.members) {
        if (member.user_id === user_id) {
          const removeUserFromChannel = await prisma.userChannelMember.update({
            where: {
              id: member.id,
            },
            data: {
              is_deleted: true,
            },
          });
          if (!removeUserFromChannel?.id) {
            return resolve({ data: { user_id, channel_id } });
          }
        }
      }

      const channelAdmin = foundChannel?.members.filter(
        (m) => !m.is_deleted && m.is_admin
      );

      if (channelAdmin.length >= 1) {
        await prisma.message.create({
          data: {
            message_id: uuid(),
            sender_id: channelAdmin[0].user_id,
            type: "notification",
            channel_id: channel_id,
            message:
              type === "remove"
                ? `${foundUser?.first_name} ${foundUser?.last_name} was removed by admin!`
                : type === "leave"
                ? `${foundUser?.first_name} ${foundUser?.last_name} left this group!`
                : "",
          },
        });
      }

      const foundUpdatedChannel = await prisma.channel.findUnique({
        where: {
          channel_id,
        },
        include: {
          messages: {
            orderBy: {
              createdAt: "desc",
            },
            take: 1,
            include: {
              channel: {
                include: {
                  members: {
                    include: {
                      user: true,
                    },
                  },
                },
              },
            },
          },
          members: {
            include: {
              user: true,
            },
          },
        },
      });

      //If channel has no member
      //Delete tha channel
      if (foundUpdatedChannel?.members?.length <= 0) {
        await prisma.channel.delete({ where: { channel_id } });
      }
      return resolve({ data: foundUpdatedChannel });
    } catch (error) {
      return reject({ error: "Something went wrong!" });
    }
  });
};

export default removeFromGroup;

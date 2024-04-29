import prisma from "../../lib/prisma.js";
import { v4 as uuid } from "uuid";
const removeFromGroup = ({ channel_id, user_id }) => {
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
        throw new Error("Channel not found");
      }

      const foundUser = await prisma.user.findUnique({ where: { user_id } });
      if (!foundUser?.id) {
        throw new Error("User not found");
      }

      //If channel has no member
      //Delete tha channel
      if (foundChannel?.members?.length <= 0) {
        await prisma.channel.delete({ where: { channel_id } });
        return resolve({ data: { user_id, channel_id } });
      }

      for (const member of foundChannel?.members) {
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
            message: `${foundUser?.first_name} ${foundUser?.last_name} was removed by admin`,
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
                  members: true,
                },
              },
            },
          },
          members: true,
        },
      });

      //If channel has no member
      //Delete tha channel
      if (foundUpdatedChannel?.members?.length <= 0) {
        await prisma.channel.delete({ where: { channel_id } });
      }
      return resolve({ data: foundUpdatedChannel });
    } catch (error) {
      const errMessage = error.message;
      return reject({ error: errMessage });
    }
  });
};

export default removeFromGroup;

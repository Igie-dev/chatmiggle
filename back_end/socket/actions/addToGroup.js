import prisma from "../../lib/prisma.js";
import { v4 as uuid } from "uuid";
const addToGroup = ({ channel_id, user_id }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const foundUser = await prisma.user.findUnique({ where: { user_id } });

      if (!foundUser?.id) {
        throw new Error("User not found");
      }

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

      const foundUserAsMember = await prisma.userChannelMember.findFirst({
        where: {
          user_id,
          channel_id,
        },
      });

      if (!foundUserAsMember?.id) {
        const addUserChannel = await prisma.userChannelMember.create({
          data: {
            user_id,
            channel_id,
          },
        });

        if (!addUserChannel?.id) {
          throw new Error("Failed to add user to group");
        }
      } else {
        if (foundUserAsMember?.is_deleted) {
          const updateChannelMember = await prisma.userChannelMember.update({
            where: {
              id: foundUserAsMember?.id,
            },
            data: {
              is_deleted: false,
            },
          });

          if (!updateChannelMember?.id) {
            throw new Error("Failed to add user to group");
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
            message: `${foundUser?.first_name} ${foundUser?.last_name} was added by admin`,
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
                    where: {
                      is_deleted: false,
                    },
                  },
                },
              },
            },
          },
          members: {
            where: {
              is_deleted: false,
            },
          },
        },
      });

      return resolve({ data: foundUpdatedChannel });
    } catch (error) {
      const errMessage = error.message;
      return reject({ error: errMessage });
    }
  });
};

export default addToGroup;

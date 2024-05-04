import prisma from "../../utils/prisma.js";
import { v4 as uuid } from "uuid";
const changeGroupName = ({ channelId, name, userId }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const foundChannel = await prisma.channel.findUnique({
        where: { channel_id: channelId },
      });

      if (!foundChannel?.id) {
        return reject({ error: "Channel not found" });
      }

      const updateChannel = await prisma.channel.update({
        where: { channel_id: channelId },
        data: { group_name: name },
      });
      if (!updateChannel?.id) {
        return reject({ error: "Failed to rename group name" });
      }

      const foundUser = await prisma.user.findUnique({
        where: { user_id: userId },
        select: {
          id: true,
          first_name: true,
          last_name: true,
        },
      });

      if (foundUser?.id) {
        await prisma.message.create({
          data: {
            message_id: uuid(),
            sender_id: userId,
            type: "notification",
            channel_id: channelId,
            message: `Group name was change by ${foundUser?.first_name} ${foundUser?.last_name} to ${name}`,
          },
        });
      }
      const foundUpdatedChannel = await prisma.channel.findUnique({
        where: {
          channel_id: channelId,
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
                    include: {
                      user: true,
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
            include: {
              user: true,
            },
          },
        },
      });
      return resolve({ data: foundUpdatedChannel });
    } catch (error) {
      return reject({ error: "Something went wrong" });
    }
  });
};

export default changeGroupName;

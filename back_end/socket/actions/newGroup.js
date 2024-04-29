import prisma from "../../lib/prisma.js";
import { v4 as uuid } from "uuid";

const createNewGroup = ({ group_name, members, message, sender_id, type }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const createChannel = await prisma.channel.create({
        data: {
          channel_id: uuid(),
          is_private: false,
          group_name,
        },
      });

      if (!createChannel?.id) {
        throw new Error("Failed to create group!");
      }

      for (const member of members) {
        const createMember = await prisma.userChannelMember.create({
          data: {
            user_id: member.user_id,
            channel_id: createChannel?.channel_id,
            is_seen: sender_id === member.user_id,
            is_admin: sender_id === member.user_id,
          },
        });
        if (!createMember?.id) {
          throw new Error("Failed to create channel members!");
        }
      }

      const createMessage = await prisma.message.create({
        data: {
          message_id: uuid(),
          sender_id,
          message,
          type,
          channel_id: createChannel?.channel_id,
        },
      });
      if (!createMessage?.id) {
        throw new Error("Failed to save message!");
      }
      const foundChannel = await prisma.channel.findUnique({
        where: { channel_id: createChannel.channel_id },
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
      if (!foundChannel?.id) {
        throw new Error("Something went wrong!");
      }
      return resolve({ data: foundChannel });
    } catch (error) {
      const errMessage = error.message;
      return reject({ error: errMessage });
    }
  });
};

export default createNewGroup;

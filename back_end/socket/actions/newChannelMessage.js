import prisma from "../../lib/prisma.js";
import { v4 as uuid } from "uuid";
const newChannelMessage = ({ channel_id, sender_id, message, type }) => {
  return new Promise(async (resolve, reject) => {
    if (!channel_id || !message || !sender_id || !type) {
      throw new Error("All field are required!");
    }
    try {
      const foundChannel = await prisma.channel.findUnique({
        where: { channel_id },
      });

      if (!foundChannel?.id) {
        throw new Error("Channel not found");
      }

      const saveMessage = await prisma.message.create({
        data: {
          message_id: uuid(),
          channel_id,
          message,
          type,
          sender_id,
        },
      });
      if (!saveMessage?.id) {
        throw new Error("Failed to save message!");
      }

      const foundChannelMember = await prisma.userChannelMember.findMany({
        where: {
          channel_id,
        },
      });

      if (foundChannelMember?.length >= 1) {
        for (const member of foundChannelMember) {
          const updateMemebers = await prisma.userChannelMember.update({
            where: {
              id: member.id,
            },
            data: {
              ...member,
              is_seen: member.user_id === sender_id,
            },
          });
          if (!updateMemebers?.id) {
            throw new Error("Failed to update members!");
          }
        }
      }

      const channel = await prisma.channel.findUnique({
        where: { channel_id: saveMessage.channel_id },
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
          members: true,
        },
      });

      if (!channel?.id) {
        throw new Error("Something went wrong!");
      }
      return resolve({ data: channel });
    } catch (error) {
      const errMessage = error.message;
      return reject({ error: errMessage });
    }
  });
};

export default newChannelMessage;

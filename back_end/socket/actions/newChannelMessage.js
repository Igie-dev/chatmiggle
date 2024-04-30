import prisma from "../../lib/prisma.js";
import { v4 as uuid } from "uuid";
const newChannelMessage = ({ channel_id, sender_id, message, type }) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!channel_id || !message || !sender_id || !type) {
        throw new Error("All field are required!");
      }
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
        for await (const member of foundChannelMember) {
          await prisma.userChannelMember.update({
            where: {
              id: member.id,
            },
            data: {
              is_seen: member.user_id === sender_id,
            },
          });
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
          members: {
            where: {
              is_deleted: false,
            },
          },
        },
      });

      if (!channel?.id) {
        throw new Error("Something went wrong!");
      }
      return resolve({ data: channel });
    } catch (error) {
      console.log(error);
      const errMessage = error.message;
      return reject({ error: errMessage });
    }
  });
};

export default newChannelMessage;

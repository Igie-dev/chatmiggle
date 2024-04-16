import prisma from "../../lib/prisma.js";
import { v4 as uuid } from "uuid";
const newChannelMessage = ({ channel_id, sender_id, message, type }) => {
  return new Promise(async (resolve, reject) => {
    if (!channel_id || !message || !sender_id || !type) {
      return reject({ error: "All field are required!" });
    }
    try {
      const foundChannel = await prisma.channel.findUnique({
        where: { channel_id },
      });

      if (!foundChannel?.id) {
        return reject({ error: "Channel not found" });
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
        return reject({ error: "Something went wrong!" });
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
                  members: true,
                },
              },
            },
          },
          members: true,
        },
      });

      if (!channel?.id) {
        return reject({ error: "Something went wrong!" });
      }
      return resolve({ data: channel });
    } catch (error) {
      console.log(error);
      return reject({ error: "Something went wrong!" });
    }
  });
};

export default newChannelMessage;

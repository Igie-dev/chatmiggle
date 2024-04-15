import prisma from "../../lib/prisma.js";
import { v4 as uuid } from "uuid";
const createNewChannel = ({ members, message, sender_id, type }) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (members.lenght <= 1 || !message || !sender_id || !type) {
        return reject({ error: "All field are required!" });
      }

      const existMembersChannel = await prisma.channel.findMany({
        where: {
          AND: [
            {
              members: {
                some: {
                  user_id: members[0].user_id,
                },
              },
            },
            {
              members: {
                some: {
                  user_id: members[1].user_id,
                },
              },
            },
          ],
        },
        select: {
          channel_id: true,
          members: {
            take: 1,
          },
        },
      });

      const data = {
        message,
        sender_id,
        message_id: uuid(),
        type: type,
      };
      if (existMembersChannel[0]?.members?.length === 2) {
        return reject({ error: "Something went wrong!" });
      }

      if (existMembersChannel?.length >= 1) {
        data.channel_id = existMembersChannel[0]?.channel_id;
        const newmessage = await prisma.message.create({ data });
        if (!newmessage?.id) {
          return reject({ error: "Something went wrong!" });
        }
      }
      if (existMembersChannel?.length <= 0) {
        data.channel_id = uuid();
        const createChannel = await prisma.channel.create({
          data: {
            channel_id: data.channel_id,
            isPrivate: true,
          },
        });
        if (!createChannel?.id) {
          return reject({ error: "Something went wrong!" });
        }

        for (const user of members) {
          var createUserChannelMember = await prisma.userChannelMember.create({
            data: {
              user_id: user.user_id,
              channel_id: createChannel?.channel_id,
            },
          });
        }

        const createMessage = await prisma.message.create({ data });

        if (!createMessage?.id || !createUserChannelMember?.id) {
          return reject({ error: "Something went wrong!" });
        }
      }

      const foundChannel = await prisma.channel.findUnique({
        where: { channel_id: data.channel_id },
        include: {
          messages: {
            orderBy: {
              createdAt: "desc",
            },
            take: 1,
          },
          members: true,
        },
      });

      return resolve({ data: foundChannel });
    } catch (error) {
      console.log(error);
      return reject({ error: "Something went wrong!" });
    }
  });
};

export default createNewChannel;

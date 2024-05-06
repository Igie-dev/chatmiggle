import prisma from "../../utils/prisma.js";
import { v4 as uuid } from "uuid";
const createNewChannel = ({ members, message, sender_id, type }) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (members.lenght <= 1 || !message || !sender_id || !type) {
        throw new Error("All field are required!");
      }

      const existMembersChannel = await prisma.channel.findFirst({
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
            {
              is_private: true,
            },
          ],
        },
        select: {
          channel_id: true,
          is_private: true,
          members: true,
        },
      });

      const data = {
        message,
        sender_id,
        message_id: uuid(),
        type: type,
      };
      //Channel exist and its private
      if (existMembersChannel?.channel_id) {
        data.channel_id = existMembersChannel?.channel_id;
        const newmessage = await prisma.message.create({ data });
        for await (const member of existMembersChannel?.members) {
          if (member.user_id === sender_id) {
            await prisma.userChannelMember.updateMany({
              where: {
                id: member.id,
              },
              data: {
                is_seen: true,
                is_deleted: false,
              },
            });
          } else {
            await prisma.userChannelMember.updateMany({
              where: {
                id: member.id,
              },
              data: {
                is_seen: false,
              },
            });
          }
        }

        if (!newmessage?.id) {
          throw new Error("Failed to create channel");
        }
      }
      if (!existMembersChannel?.channel_id) {
        //If channel not exist or channel is not private
        data.channel_id = uuid();
        const createChannel = await prisma.channel.create({
          data: {
            channel_id: data.channel_id,
            is_private: true,
          },
        });

        if (!createChannel?.id) {
          throw new Error("Failed to create channel");
        }

        for await (const user of members) {
          const createUserChannelMember = await prisma.userChannelMember.create(
            {
              data: {
                user_id: user.user_id,
                channel_id: createChannel?.channel_id,
              },
            }
          );
          if (!createUserChannelMember?.id) {
            throw new Error("Something went wrong!");
          }
        }

        const createMessage = await prisma.message.create({ data });

        if (!createMessage?.id) {
          throw new Error("Something went wrong!");
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
      if (!foundChannel?.id) {
        throw new Error("Something went wrong!");
      }
      data.message_id = "";
      return resolve({ data: foundChannel });
    } catch (error) {
      const errMessage = error.message;
      return reject({ error: errMessage });
    }
  });
};

export default createNewChannel;

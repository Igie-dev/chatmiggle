import prisma from "../../lib/prisma.js";
import { v4 as uuid } from "uuid";
const createNewChannel = ({ members, message, sender_id, type }) => {
  return new Promise(async (resolve, reject) => {
    if (members.lenght <= 1 || !message || !sender_id || !type) {
      return reject({ message: "All field are required!" });
    }
    try {
      const existMembersChannel = await prisma.channel.findMany({
        where: {
          members: {
            some: {
              AND: [
                {
                  user_id: members[0].user_id,
                },
                {
                  user_id: members[1].user_id,
                },
              ],
            },
          },
        },
      });

      const data = {
        message,
        sender_id,
        message_id: uuid(),
        type: type,
      };

      if (existMembersChannel?.channel_id) {
        console.log("Did exist");
        data.channel_id = existMembersChannel?.channel_id;
        const newmessage = await prisma.message.create({ data });
        if (!newmessage?.id) {
          throw new Error("Something went wrong!");
        }
      }

      if (!existMembersChannel?.channel_id) {
        console.log("Not exist");
        data.channel_id = uuid();
        const createChannel = await prisma.channel.create({
          data: {
            channel_id: data.channel_id,
          },
        });
        if (!createChannel?.id) {
          throw new Error("Something went wrong!");
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
          throw new Error("Something went wrong!");
        }
      }

      const foundMessage = await prisma.message.findUnique({
        where: { message_id: data.message_id },
      });

      return resolve({ data: foundMessage });
    } catch (error) {
      console.log(error);
      return reject({ error: "Something went wrong!" });
    }
  });
};

export default createNewChannel;

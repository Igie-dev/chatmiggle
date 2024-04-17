import prisma from "../../lib/prisma.js";
const seenControl = ({ channel_id, user_id }) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!channel_id || !user_id) {
        return reject({ error: "All field are required!" });
      }

      const foundChannelMember = await prisma.userChannelMember.findMany({
        where: {
          channel_id,
        },
      });

      if (foundChannelMember?.length <= 0) {
        return reject({ error: "Something went wrong!" });
      }

      const user = foundChannelMember.filter((u) => u.user_id === user_id)[0];
      const updateUserSeen = await prisma.userChannelMember.update({
        where: {
          id: user.id,
        },
        data: {
          ...user,
          is_seen: true,
        },
      });

      if (!updateUserSeen?.id) {
        return reject({ error: "Something went wrong!" });
      }

      const foundChannel = await prisma.channel.findUnique({
        where: {
          channel_id,
        },
        include: {
          members: true,
        },
      });

      if (!foundChannel?.id) {
        return reject({ error: "Something went wrong!" });
      }
      return resolve({ data: foundChannel });
    } catch (error) {
      console.log(error);
      return reject({ error: "Something went wrong!" });
    }
  });
};

export default seenControl;

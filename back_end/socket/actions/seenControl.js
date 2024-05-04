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
        return reject({ error: "Failed to get channel members!" });
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
        return reject({ error: "Failed to update seen!" });
      }

      const channel = await prisma.channel.findUnique({
        where: { channel_id },
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

      if (!channel?.id) {
        throw new Error({ error: "Something went wrong!" });
      }
      return resolve({ data: channel });
    } catch (error) {
      return reject({ error: "Something went wrong!" });
    }
  });
};

export default seenControl;

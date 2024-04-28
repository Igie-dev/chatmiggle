import prisma from "../../lib/prisma.js";
const removeFromGroup = ({ channel_id, user_id }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const foundChannel = await prisma.channel.findUnique({
        where: { channel_id },
        include: {
          members: {
            where: {
              is_deleted: false,
            },
          },
        },
      });

      if (!foundChannel?.id) {
        throw new Error("Channel not found");
      }

      const foundUser = await prisma.user.findUnique({ where: { user_id } });
      if (!foundUser?.id) {
        throw new Error("User not found");
      }

      //If channel has no member
      //Delete tha channel
      if (foundChannel?.members?.length <= 0) {
        await prisma.channel.delete({ where: { channel_id } });
        return resolve({ data: { user_id, channel_id } });
      }

      for (const member of foundChannel?.members) {
        if (member.user_id === user_id) {
          const removeUserFromChannel = await prisma.userChannelMember.update({
            where: {
              id: member.id,
            },
            data: {
              is_deleted: true,
            },
          });
          if (!removeUserFromChannel?.id) {
            return resolve({ data: { user_id, channel_id } });
          }
        }
      }

      const foundUpdatedMembersChannel = await prisma.channel.findUnique({
        where: { channel_id },
        include: {
          members: true,
        },
      });

      //If channel has no member
      //Delete tha channel
      if (foundUpdatedMembersChannel?.members?.length <= 0) {
        await prisma.channel.delete({ where: { channel_id } });
      }
      return resolve({ data: foundUpdatedMembersChannel });
    } catch (error) {
      const errMessage = error.message;
      return reject({ error: errMessage });
    }
  });
};

export default removeFromGroup;

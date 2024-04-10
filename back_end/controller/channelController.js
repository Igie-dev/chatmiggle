import asyncHandler from "express-async-handler";
import prisma from "../lib/prisma.js";

const getUserChannels = asyncHandler(async (req, res) => {
  const user_id = req.params.id;
  try {
    const foundUser = await prisma.user.findUnique({
      where: { user_id },
      include: {
        membered_channel: {
          include: {
            channel: true,
          },
        },
      },
    });

    if (!foundUser?.id || foundUser?.membered_channel?.length <= 0) {
      return res.status(404).json({ message: "No channel found" });
    }

    const userChannels = [];
    for (const channel of foundUser?.membered_channel) {
      const foundChannel = await prisma.channel.findUnique({
        where: { channel_id: channel.channel_id },
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

      if (foundChannel?.messages?.length >= 1) {
        userChannels.push(foundChannel);
      }
    }

    userChannels?.sort(
      (a, b) => b.messages[0].createdAt - a.messages[0].createdAt
    );

    return res.status(200).json(userChannels);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
});

const verifyUserInChannel = asyncHandler(async (req, res) => {
  const channel_id = req.params.channelId;
  const user_id = req.params.userId;

  try {
    const foundChannel = await prisma.channel.findUnique({
      where: { channel_id },
      include: {
        members: {
          where: {
            user_id,
          },
        },
      },
    });

    if (!foundChannel?.id) {
      return res.status(404).json({ message: "Channel not found" });
    }

    if (foundChannel?.members?.length <= 0) {
      return res.status(401).json({ message: "Unauthorized!" });
    }

    return res.status(200).json({ c: channel_id });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
});
export { getUserChannels, verifyUserInChannel };

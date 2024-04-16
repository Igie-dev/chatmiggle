import asyncHandler from "express-async-handler";
import prisma from "../lib/prisma.js";

const getUserChannels = asyncHandler(async (req, res) => {
  const user_id = req.params.userId;

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

    return res.status(200).json({ channel_id: channel_id });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
});

const getChannelMessages = asyncHandler(async (req, res) => {
  const channelId = req.params.channelId;
  const take = JSON.parse(req.query.take);
  const cursor = req.query.cursor;
  try {
    const query = {
      where: { channel_id: channelId },
      include: {
        messages: {
          orderBy: {
            createdAt: "asc",
          },
          take: -Number(take),
          include: {
            channel: {
              include: {
                members: true,
              },
            },
          },
        },
      },
    };

    if (cursor) {
      query.include.messages.cursor = {
        id: Number(cursor),
      };
      query.include.messages.skip = 1;
    }

    const foundChannel = await prisma.channel.findUnique(query);

    if (!foundChannel?.id) {
      return res.status(404).json({ message: "Channel not found" });
    }

    console.log(foundChannel);
    const nextCursorId =
      foundChannel.messages.length >= 100 ? foundChannel.messages[0].id : null;
    return res
      .status(200)
      .json({ messages: foundChannel.messages, cursor: nextCursorId });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
});

const getChannel = asyncHandler(async (req, res) => {
  const channel_id = req.params.channelId;

  try {
    const foundChannel = await prisma.channel.findUnique({
      where: { channel_id },
      include: {
        members: true,
      },
    });

    if (!foundChannel?.id) {
      return res.status(404).json({ message: "Channel not found" });
    }

    return res.status(200).json(foundChannel);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
});
export { getUserChannels, verifyUserInChannel, getChannelMessages, getChannel };

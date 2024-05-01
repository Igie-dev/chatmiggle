import asyncHandler from "express-async-handler";
import prisma from "../lib/prisma.js";
import dotenv from "dotenv";
dotenv.config();
const messagesLimit = process.env.MESSAGES_LIMIT;

const getUserChannels = asyncHandler(async (req, res) => {
  const user_id = req.params.userId;

  try {
    const foundUser = await prisma.user.findUnique({
      where: { user_id },
      include: {
        membered_channel: {
          where: {
            is_deleted: false,
          },
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
    for await (const channel of foundUser?.membered_channel) {
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
            is_deleted: false,
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
                members: {
                  where: {
                    is_deleted: false,
                  },
                },
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

    const nextCursorId =
      foundChannel.messages.length >= messagesLimit
        ? foundChannel.messages[0].id
        : null;

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

const getUserGroups = asyncHandler(async (req, res) => {
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
      if (!channel.channel.is_private) {
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

        if (foundChannel?.messages?.length >= 1) {
          userChannels.push(foundChannel);
        }
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

const getMembersChannel = asyncHandler(async (req, res) => {
  const { members } = req.body;
  if (members?.length < 2) {
    return res.status(400).json({ message: "Members atleast has 2 users" });
  }
  try {
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
        members: {
          take: 1,
        },
      },
    });

    if (existMembersChannel?.length <= 0) {
      return res.status(404).json({ message: "No channel found" });
    }
    const foundChannel = await prisma.channel.findUnique({
      where: { channel_id: existMembersChannel?.channel_id },
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
    if (!foundChannel?.id) {
      return reject({ error: "Something went wrong!" });
    }

    return res.status(200).json(foundChannel);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
});

const deleteChannel = asyncHandler(async (req, res) => {
  const channelId = req.params.channelId;
  const userId = req.params.userId;
  try {
    const foundUser = await prisma.userChannelMember.findFirst({
      where: {
        AND: [
          { user_id: userId },
          { channel_id: channelId },
          { is_deleted: false },
        ],
      },
    });

    if (!foundUser?.id) {
      return res.status(404).json({ message: "User not admin" });
    }

    const foundChannel = await prisma.channel.findUnique({
      where: { channel_id: channelId },
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

    if (!foundChannel?.id) {
      return res.status(404).json({ message: "Channel not found" });
    }

    //Channel is private
    if (foundChannel?.is_private) {
      //remove user from channel if channel is private
      const foundChannelMembers = foundChannel?.members;
      const checkMemberOfPrivate = foundChannelMembers.filter(
        (m) => !m.is_deleted
      );

      if (checkMemberOfPrivate.length <= 1) {
        //Delete channel if channel is group
        await prisma.channel.delete({
          where: { channel_id: channelId },
        });
      } else {
        await prisma.userChannelMember.updateMany({
          where: { AND: [{ user_id: userId }, { channel_id: channelId }] },
          data: {
            is_deleted: true,
          },
        });
      }

      const channel = foundChannel;
      channel.members = foundChannel.members.map((m) => {
        if (m.user_id === userId) {
          return { ...m, is_deleted: true };
        }
        return m;
      });
      return res.status(200).json(channel);
    }

    //Channel is group
    if (!foundUser?.is_admin) {
      return res
        .status(500)
        .json({ message: "Failed to delete user not admin" });
    }

    //Delete channel if channel is group
    await prisma.channel.delete({
      where: { channel_id: channelId },
    });

    const channel = foundChannel;
    channel.members = foundChannel?.members.map((m) => {
      return { ...m, is_deleted: true };
    });

    return res.status(200).json(channel);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
});

export {
  getUserChannels,
  verifyUserInChannel,
  getChannelMessages,
  getChannel,
  getUserGroups,
  getMembersChannel,
  deleteChannel,
};

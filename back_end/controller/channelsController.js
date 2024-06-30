import asyncHandler from "express-async-handler";
import prisma from "../utils/prisma.js";
import dotenv from "dotenv";
import { v4 as uuid } from "uuid";
import {
  emitNewMessage,
  emitChangeGroupName,
  emitingRemoveGroupMember,
  emitingLeaveGroup,
  emitingSeen,
} from "../socket/socket.js";
import {
  channelDto,
  channelMembersDto,
  channelsDto,
  messagesDto,
} from "../dto/channelDto.js";
dotenv.config();
const messagesLimit = process.env.MESSAGES_LIMIT;

const createChannel = asyncHandler(async (req, res) => {
  try {
    const { members, senderId, type, message, channelName } = req.body;

    if (
      members?.lenght <= 1 ||
      !message ||
      !senderId ||
      !type ||
      !channelName
    ) {
      return res.status(400).json({ message: "All field are required!" });
    }

    const createChannel = await prisma.channel.create({
      data: {
        channel_id: uuid(),
        channel_name: channelName,
      },
    });

    if (createChannel?.id) {
      for (let member of members) {
        await prisma.channelMember.create({
          data: {
            user_id: member.userId,
            channel_id: createChannel?.channel_id,
            join_approved: true,
            is_admin: member.userId === senderId,
          },
        });
      }
    }

    await prisma.message.create({
      data: {
        message_id: uuid(),
        sender_id: senderId,
        message: message,
        type: "text",
        channel_id: createChannel?.channel_id,
      },
    });

    const channel = await prisma.channel.findUnique({
      where: { channel_id: createChannel?.channel_id },
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
                    join_approved: true,
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
            join_approved: true,
          },
          include: {
            user: true,
          },
        },
      },
    });

    if (!channel?.id) {
      res.status(500).json({ message: "Something went wrong!" });
    }

    const channelData = channelDto(channel);
    for await (let member of members) {
      emitNewMessage(member.userId, channelData);
    }

    return res.status(200).json(channelData);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong!" });
  }
});

const userChannels = asyncHandler(async (req, res) => {
  const userId = req.params.userId;
  const search = req.query.search;

  try {
    const foundUser = await prisma.user.findUnique({
      where: { user_id: userId },
      include: {
        channels: {
          where: {
            join_approved: true,
          },
          include: {
            channel: {
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
                            join_approved: true,
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
                  include: {
                    user: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!foundUser?.id || foundUser?.channels?.length <= 0) {
      return res.status(404).json({ error: "No channel found" });
    }

    const userChannels = foundUser?.channels.map((c) => ({
      id: c?.channel?.id,
      channel_id: c?.channel?.channel_id,
      channel_name: c?.channel?.channel_name,
      avatar_id: c?.channel?.avatar_id,
      createdAt: c?.channel?.createdAt,
      updatedAt: c?.channel?.updatedAt,
      messages: c?.channel?.messages,
      members: c?.channel?.members,
    }));

    let channels = [];
    if (search) {
      const lowercaseSearch = search.toLowerCase();
      const filterChannels = userChannels?.filter((c) =>
        c.group_name?.toLowerCase().includes(lowercaseSearch)
      );

      channels = filterChannels;
    } else {
      channels = userChannels;
    }

    channels?.sort((a, b) => b.messages[0].createdAt - a.messages[0].createdAt);

    const channelsData = channelsDto(channels);

    return res.status(200).json(channelsData);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong!" });
  }
});

const getChannel = asyncHandler(async (req, res) => {
  const channelId = req.params.channelId;
  try {
    const foundChannel = await prisma.channel.findUnique({
      where: { channel_id: channelId },
      include: {
        members: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!foundChannel?.id) {
      return res.status(404).json({ error: "Channel not found" });
    }

    const channelData = channelDto(foundChannel);
    return res.status(200).json(channelData);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
});

const deleteChannel = asyncHandler(async (req, res) => {
  const { channelId, userId } = req.body;
  try {
    if (!channelId || !userId) {
      return res.status(400).json({ message: "All field are required" });
    }

    const foundUser = await prisma.channelMember.findFirst({
      where: {
        AND: [
          { user_id: userId },
          { channel_id: channelId },
          { join_approved: false },
          { is_admin: true },
        ],
      },
    });

    if (!foundUser?.id) {
      return res.status(404).json({ error: "User not admin" });
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
                members: {
                  include: {
                    user: true,
                  },
                },
              },
            },
          },
        },
        members: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!foundChannel?.id) {
      return res.status(404).json({ error: "Channel not found" });
    }

    //Delete channel if channel is group
    await prisma.channel.delete({
      where: { channel_id: channelId },
    });

    await prisma.channelMembers.delete({
      where: {
        channel_id: channelId,
      },
    });

    for await (let member of foundChannel.members) {
      emitingRemoveGroupMember(member.user_id, {
        channel_id: foundChannel.channel_id,
        user_id: userId,
      });
      emitNewMessage(member.user_id, foundChannel);
    }

    return res.status(200).json({ message: "Channel deleted" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong!" });
  }
});

const channelMessages = asyncHandler(async (req, res) => {
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
                    join_approved: true,
                  },
                  include: {
                    user: {
                      select: {
                        user_id: true,
                        id: true,
                        first_name: true,
                        last_name: true,
                        email: true,
                      },
                    },
                  },
                },
              },
            },
            user: {
              select: {
                user_id: true,
                id: true,
                first_name: true,
                last_name: true,
                email: true,
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

    const foundChannel = await prisma.channel.findFirst(query);

    if (!foundChannel?.id) {
      return res.status(404).json({ error: "Channel not found" });
    }
    const nextCursorId =
      foundChannel.messages?.length >= messagesLimit
        ? foundChannel.messages[0].id
        : null;

    const messages = messagesDto(foundChannel.messages);
    return res.status(200).json({ messages: messages, cursor: nextCursorId });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
});

const sendMessage = asyncHandler(async (req, res) => {
  try {
    const { channelId, senderId, message, type } = req.body;
    if (!channelId || !message || !senderId || !type) {
      return res.status(500).json({ message: "All field are required!" });
    }
    const foundChannel = await prisma.channel.findUnique({
      where: {
        channel_id: channelId,
      },
    });

    if (!foundChannel?.id) {
      return res.status(500).json({ message: "Channel not found" });
    }

    const saveMessage = await prisma.message.create({
      data: {
        message_id: uuid(),
        channel_id: channelId,
        message,
        type,
        sender_id: senderId,
      },
    });

    if (!saveMessage?.id) {
      return res.status(500).json({ message: "Failed to save message!" });
    }

    const foundChannelMember = await prisma.channelMember.findMany({
      where: {
        channel_id: channelId,
      },
    });

    if (foundChannelMember?.length >= 1) {
      for await (const member of foundChannelMember) {
        await prisma.channelMember.update({
          where: {
            id: member.id,
          },
          data: {
            is_seen: member.user_id === senderId,
          },
        });
      }
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
                members: {
                  where: {
                    join_approved: true,
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
            join_approved: true,
          },
          include: {
            user: true,
          },
        },
      },
    });

    if (!channel?.id) {
      res.status(500).json({ message: "Something went wrong!" });
    }

    const channelData = channelDto(channel);
    for await (let member of channelData.members) {
      console.log(member);
      emitNewMessage(member.userId, channelData);
    }
    return res.status(200).json(channelData);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong!" });
  }
});

const removeFromChannel = asyncHandler(async (req, res) => {
  try {
    const { channelId, userId, type } = req.body;
    if (!channelId || !userId || !type) {
      return res.status(400).json({ message: "All field are required!" });
    }

    const foundChannel = await prisma.channel.findUnique({
      where: { channel_id: channelId },
      include: {
        members: {
          where: {
            join_approved: true,
          },
        },
      },
    });

    if (!foundChannel?.id) {
      return res.status(404).json({ message: "Channel not found" });
    }

    const foundUser = await prisma.user.findUnique({
      where: { user_id: userId },
    });

    if (!foundUser?.id) {
      return res.status(404).json({ message: "User not found" });
    }

    //If channel has no member
    //Delete tha channel
    if (foundChannel?.members?.length <= 0) {
      await prisma.channel.delete({ where: { channel_id: channelId } });
      emitingLeaveGroup(userId, {
        channel_id: channelId,
        user_id: userId,
      });
      return res
        .status(200)
        .json({ data: { user_id: userId, channel_id: channelId } });
    }

    for await (let member of foundChannel?.members) {
      if (member.user_id === userId) {
        await prisma.channelMember.delete({
          where: {
            user_id: userId,
          },
        });
      }
    }

    const channelAdmin = foundChannel?.members.filter(
      (m) => join_approved && m.is_admin
    );

    if (channelAdmin.length >= 1) {
      await prisma.message.create({
        data: {
          message_id: uuid(),
          sender_id: channelAdmin[0].user_id,
          type: "notification",
          channel_id: channelId,
          message:
            type === "remove"
              ? `${foundUser?.first_name} ${foundUser?.last_name} was removed by admin!`
              : type === "leave"
              ? `${foundUser?.first_name} ${foundUser?.last_name} left this group!`
              : "",
        },
      });
    }

    const foundUpdatedChannel = await prisma.channel.findUnique({
      where: {
        channel_id: channelId,
      },
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
                  include: {
                    user: {
                      where: {
                        join_approved: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
        members: {
          include: {
            user: {
              where: {
                join_approved: true,
              },
            },
          },
        },
      },
    });

    //If channel has no member
    //Delete tha channel
    if (foundUpdatedChannel?.members?.length <= 0) {
      await prisma.channel.delete({ where: { channel_id: channelId } });
    }

    const channelData = channelDto(foundUpdatedChannel);

    for await (let member of foundUpdatedChannel.members) {
      emitingRemoveGroupMember(member.user_id, {
        channel_id: foundUpdatedChannel.channel_id,
        user_id: userId,
      });

      if (member.join_approved) {
        emitNewMessage(member.user_id, channelData);
      }
    }

    return res.status(200).json(channelData);
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong!" });
  }
});

const seenChannel = asyncHandler(async (req, res) => {
  try {
    const { channelId, userId } = req.body;
    if (!channelId || !userId) {
      return res.status(400).json({ message: "All field are required!" });
    }

    const foundChannelMember = await prisma.channelMember.findMany({
      where: {
        AND: [{ channel_id: channelId }, { user_id: userId }],
      },
    });

    if (foundChannelMember?.length <= 0) {
      return res
        .status(500)
        .json({ message: "Failed to get channel members!" });
    }
    const updateUserSeen = await prisma.channelMember.update({
      where: {
        id: foundChannelMember[0].id,
      },
      data: {
        is_seen: true,
      },
    });
    if (!updateUserSeen?.id) {
      return res.status(500).json({ message: "Failed to update seen!" });
    }

    const channel = await prisma.channel.findUnique({
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
                members: {
                  where: {
                    join_approved: true,
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
            join_approved: true,
          },
          include: {
            user: true,
          },
        },
      },
    });

    const channelData = channelDto(channel);
    if (!channel?.id) {
      return res.status(500).json({ message: "Something went wrong!" });
    }
    for await (let member of channel?.members) {
      emitingSeen(member.user_id, channelData);
    }
    return res.status(200).json(channelData);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong!" });
  }
});

const changeGroupName = asyncHandler(async (req, res) => {
  try {
    const { channelId, name, userId } = req.body;
    const foundChannel = await prisma.channel.findUnique({
      where: { channel_id: channelId },
    });

    if (!foundChannel?.id) {
      return res.status(404).json({ message: "Channel not found" });
    }

    const updateChannel = await prisma.channel.update({
      where: { channel_id: channelId },
      data: { group_name: name },
    });
    if (!updateChannel?.id) {
      return res.status(500).json({ message: "Failed to rename group name" });
    }

    const foundUser = await prisma.user.findUnique({
      where: { user_id: userId },
      select: {
        id: true,
        first_name: true,
        last_name: true,
      },
    });

    if (foundUser?.id) {
      await prisma.message.create({
        data: {
          message_id: uuid(),
          sender_id: userId,
          type: "notification",
          channel_id: channelId,
          message: `Group name was change by ${foundUser?.first_name} ${foundUser?.last_name} to ${name}`,
        },
      });
    }
    const foundUpdatedChannel = await prisma.channel.findUnique({
      where: {
        channel_id: channelId,
      },
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
                    join_approved: true,
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
            join_approved: true,
          },
          include: {
            user: true,
          },
        },
      },
    });

    const channelData = channelDto(foundUpdatedChannel);
    for await (let member of foundUpdatedChannel.members) {
      emitChangeGroupName(member.user_id, {
        channel_id: channelId,
        group_name: name,
      });
      emitNewMessage(member.user_id, channelData);
    }
    return res.status(200).json({ data: channelData });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong!" });
  }
});

const getChannelMembers = asyncHandler(async (req, res) => {
  try {
    const channelId = req.params.channelId;

    const foundMembers = await prisma.channelMember.findMany({
      where: {
        AND: [{ channel_id: channelId }, { join_approved: true }],
      },
      include: {
        user: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
            user_id: true,
            avatar_id: true,
          },
        },
      },
    });

    const memberData = channelMembersDto(foundMembers);

    return res.status(200).json(memberData);
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong!" });
  }
});

const getChannelRequestJoin = asyncHandler(async (req, res) => {
  try {
    const channelId = req.params.channelId;

    const foundMembers = await prisma.channelMember.findMany({
      where: {
        AND: [{ channel_id: channelId }, { join_approved: false }],
      },
      include: {
        user: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
            user_id: true,
            avatar_id: true,
          },
        },
      },
    });

    const memberData = channelMembersDto(foundMembers);

    return res.status(200).json(memberData);
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong!" });
  }
});

const requestJoinChannel = asyncHandler(async (req, res) => {
  try {
    const { channelId, userId } = req.body;
    const join = await prisma.channelMember.create({
      data: {
        channel_id: channelId,
        user_id: userId,
      },
    });
    if (!join?.id) {
      throw new Error("Failed to join");
    }

    return res.status(200).json({ channelId, userId });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong!" });
  }
});

const acceptRequestChannelJoin = asyncHandler(async (req, res) => {
  try {
    const { channelId, userId } = req.body;

    const foundReq = await prisma.channelMember.findFirst({
      where: {
        AND: [{ channel_id: channelId }, { user_id: userId }],
      },
    });
    if (!foundReq?.id) {
      return res.status(404).json({ message: "Request not found!" });
    }
    console.log(foundReq);
    await prisma.channelMember.update({
      where: {
        id: foundReq?.id,
      },
      data: {
        join_approved: true,
      },
    });

    return res.status(200).json({ message: "Request accepted" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong!" });
  }
});

export {
  createChannel,
  userChannels,
  getChannel,
  deleteChannel,
  channelMessages,
  sendMessage,
  removeFromChannel,
  seenChannel,
  changeGroupName,
  requestJoinChannel,
  getChannelMembers,
  getChannelRequestJoin,
  acceptRequestChannelJoin,
};

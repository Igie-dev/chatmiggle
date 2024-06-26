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
  emitingAddGroupMember,
} from "../socket/socket.js";
dotenv.config();
const messagesLimit = process.env.MESSAGES_LIMIT;

const createChannel = asyncHandler(async (req, res) => {
  try {
    const { members, sender_id, type, message } = req.body;

    console.log(req.body);
    if (members?.lenght <= 1 || !message || !sender_id || !type) {
      return res.status(400).json({ message: "All field are required!" });
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
        return res.status(500).json({ message: "Failed to create channel" });
      }
    } else {
      //If channel not exist or channel is not private
      data.channel_id = uuid();
      const createChannel = await prisma.channel.create({
        data: {
          channel_id: data.channel_id,
          is_private: true,
        },
      });

      if (!createChannel?.id) {
        return res.status(500).json({ message: "Failed to create channel" });
      }

      for await (const user of members) {
        const createUserChannelMember = await prisma.userChannelMember.create({
          data: {
            user_id: user.user_id,
            channel_id: createChannel?.channel_id,
          },
        });
        if (!createUserChannelMember?.id) {
          res.status(500).json({ message: "Something went wrong!" });
        }
      }

      const createMessage = await prisma.message.create({ data });

      if (!createMessage?.id) {
        res.status(500).json({ message: "Something went wrong!" });
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
      res.status(500).json({ message: "Something went wrong!" });
    }
    data.message_id = "";

    for await (let member of members) {
      emitNewMessage(member.user_id, foundChannel);
    }

    return res.status(200).json(foundChannel);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong!" });
  }
});

const createGroupChannel = asyncHandler(async (req, res) => {
  try {
    const { group_name, members, message, sender_id, type } = req.body;

    if (!group_name || members.length <= 0 || !message || !sender_id || !type) {
      return res.status(500).json({ message: "All field required" });
    }

    const createChannel = await prisma.channel.create({
      data: {
        channel_id: uuid(),
        is_private: false,
        group_name,
      },
    });

    if (!createChannel?.id) {
      return res.status(500).json({ message: "Failed to create group!" });
    }

    for (const member of members) {
      const createMember = await prisma.userChannelMember.create({
        data: {
          user_id: member.user_id,
          channel_id: createChannel?.channel_id,
          is_seen: sender_id === member.user_id,
          is_admin: sender_id === member.user_id,
        },
      });
      if (!createMember?.id) {
        return res
          .status(500)
          .json({ message: "Failed to create channel members!" });
      }
    }

    const createMessage = await prisma.message.create({
      data: {
        message_id: uuid(),
        sender_id,
        message,
        type,
        channel_id: createChannel?.channel_id,
      },
    });
    if (!createMessage?.id) {
      return res.status(500).json({ message: "Failed to save message!" });
    }
    const foundChannel = await prisma.channel.findUnique({
      where: { channel_id: createChannel.channel_id },
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
      res.status(500).json({ message: "Something went wrong!" });
    }

    for await (let member of foundChannel.members) {
      emitNewMessage(member.user_id, foundChannel);
    }
    return res.status(200).json(foundChannel);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong!" });
  }
});

const userChannels = asyncHandler(async (req, res) => {
  const user_id = req.params.userId;
  const search = req.query.search;

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
      return res.status(404).json({ error: "No channel found" });
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
      if (foundChannel?.messages?.length >= 1) {
        userChannels.push(foundChannel);
      }
    }

    let channels = [];
    if (search) {
      const lowercaseSearch = search.toLowerCase();
      const filteredByGroupName = userChannels?.filter(
        (c) =>
          c.group_name?.toLowerCase().includes(lowercaseSearch) && !c.is_private
      );
      const filterByName = userChannels?.filter(
        (c) =>
          c.is_private &&
          c.members.some((m) => {
            const fullName = `${m.user.first_name.toLowerCase()} ${m.user.last_name.toLowerCase()}`;
            return fullName.includes(lowercaseSearch);
          })
      );
      if (filteredByGroupName.length >= 1 || filterByName.length >= 1) {
        if (filterByName.length >= 1) {
          channels = filterByName;
        }
        if (filteredByGroupName.length >= 1) {
          channels = filteredByGroupName;
        }
      } else {
        channels = [];
      }
    } else {
      channels = userChannels;
    }

    channels?.sort((a, b) => b.messages[0].createdAt - a.messages[0].createdAt);

    return res.status(200).json(channels);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong!" });
  }
});

const getChannel = asyncHandler(async (req, res) => {
  const channel_id = req.params.channelId;
  try {
    const foundChannel = await prisma.channel.findUnique({
      where: { channel_id },
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
    return res.status(200).json(foundChannel);
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
      emitingLeaveGroup(userId, {
        channel_id: channelId,
        user_id: userId,
      });
      return res.status(200).json(channel);
    }

    //Channel is group
    if (!foundUser?.is_admin) {
      return res.status(500).json({ error: "Failed to delete user not admin" });
    }

    //Delete channel if channel is group
    await prisma.channel.delete({
      where: { channel_id: channelId },
    });

    const channel = foundChannel;
    channel.members = foundChannel?.members.map((m) => {
      return { ...m, is_deleted: true };
    });

    for await (let member of channel.members) {
      emitingRemoveGroupMember(member.user_id, {
        channel_id: channel.channel_id,
        user_id: userId,
      });
      emitNewMessage(member.user_id, channel);
    }

    return res.status(200).json(channel);
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
      return res.status(404).json({ error: "Channel not found" });
    }

    const nextCursorId =
      foundChannel.messages.length >= messagesLimit
        ? foundChannel.messages[0].id
        : null;

    return res
      .status(200)
      .json({ messages: foundChannel.messages, cursor: nextCursorId });
  } catch (error) {
    return res.status(500).json({ error: "Something went wrong" });
  }
});

const sendMessage = asyncHandler(async (req, res) => {
  try {
    const { channel_id, sender_id, message, type } = req.body;
    if (!channel_id || !message || !sender_id || !type) {
      return res.status(500).json({ message: "All field are required!" });
    }
    const foundChannel = await prisma.channel.findUnique({
      where: { channel_id },
    });

    if (!foundChannel?.id) {
      return res.status(500).json({ message: "Channel not found" });
    }

    const saveMessage = await prisma.message.create({
      data: {
        message_id: uuid(),
        channel_id,
        message,
        type,
        sender_id,
      },
    });

    if (!saveMessage?.id) {
      return res.status(500).json({ message: "Failed to save message!" });
    }

    const foundChannelMember = await prisma.userChannelMember.findMany({
      where: {
        channel_id,
      },
    });

    if (foundChannelMember?.length >= 1) {
      for await (const member of foundChannelMember) {
        await prisma.userChannelMember.update({
          where: {
            id: member.id,
          },
          data: {
            is_seen: member.user_id === sender_id,
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
      res.status(500).json({ message: "Something went wrong!" });
    }
    for await (let member of channel.members) {
      emitNewMessage(member.user_id, channel);
    }
    return res.status(200).json(channel);
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong!" });
  }
});

const addToGroup = asyncHandler(async (req, res) => {
  try {
    const { channel_id, user_id } = req.body;
    if (!channel_id || !user_id) {
      return res.status(400).json({ message: "All field required" });
    }
    const foundUser = await prisma.user.findUnique({ where: { user_id } });

    if (!foundUser?.id) {
      return res.status(404).json({ message: "User not found" });
    }

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
      return res.status(404).json({ message: "Channel not found" });
    }

    const foundUserAsMember = await prisma.userChannelMember.findFirst({
      where: {
        user_id,
        channel_id,
      },
    });

    if (!foundUserAsMember?.id) {
      const addUserChannel = await prisma.userChannelMember.create({
        data: {
          user_id,
          channel_id,
        },
      });

      if (!addUserChannel?.id) {
        return res.status(500).json({ message: "Failed to add user to group" });
      }
    } else {
      if (foundUserAsMember?.is_deleted) {
        const updateChannelMember = await prisma.userChannelMember.update({
          where: {
            id: foundUserAsMember?.id,
          },
          data: {
            is_deleted: false,
          },
        });

        if (!updateChannelMember?.id) {
          return res
            .status(500)
            .json({ message: "Failed to add user to group" });
        }
      }
    }

    const channelAdmin = foundChannel?.members.filter(
      (m) => !m.is_deleted && m.is_admin
    );

    if (channelAdmin.length >= 1) {
      await prisma.message.create({
        data: {
          message_id: uuid(),
          sender_id: channelAdmin[0].user_id,
          type: "notification",
          channel_id: channel_id,
          message: `${foundUser?.first_name} ${foundUser?.last_name} was added by admin`,
        },
      });
    }

    const foundUpdatedChannel = await prisma.channel.findUnique({
      where: {
        channel_id,
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

    for await (let member of foundUpdatedChannel?.members) {
      emitNewMessage(member.user_id, foundUpdatedChannel);
      emitingAddGroupMember(member.user_id, foundUpdatedChannel);
    }
    return res.status(200).json(foundUpdatedChannel);
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong!" });
  }
});

const removeFromChannel = asyncHandler(async (req, res) => {
  try {
    const { channel_id, user_id, type } = req.body;
    if (!channel_id || !user_id || !type) {
      return res.status(400).json({ message: "All field are required!" });
    }

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
      return res.status(404).json({ message: "Channel not found" });
    }

    const foundUser = await prisma.user.findUnique({ where: { user_id } });
    if (!foundUser?.id) {
      return res.status(404).json({ message: "User not found" });
    }

    //If channel has no member
    //Delete tha channel
    if (foundChannel?.members?.length <= 0) {
      await prisma.channel.delete({ where: { channel_id } });
      emitingLeaveGroup(user_id, {
        channel_id,
        user_id,
      });
      return res.status(200).json({ data: { user_id, channel_id } });
    }

    for await (let member of foundChannel?.members) {
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
          emitingLeaveGroup(user_id, {
            channel_id,
            user_id,
          });
          return res.status(200).json({ data: { user_id, channel_id } });
        }
      }
    }

    const channelAdmin = foundChannel?.members.filter(
      (m) => !m.is_deleted && m.is_admin
    );

    if (channelAdmin.length >= 1) {
      await prisma.message.create({
        data: {
          message_id: uuid(),
          sender_id: channelAdmin[0].user_id,
          type: "notification",
          channel_id: channel_id,
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
        channel_id,
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

    //If channel has no member
    //Delete tha channel
    if (foundUpdatedChannel?.members?.length <= 0) {
      await prisma.channel.delete({ where: { channel_id } });
    }

    for await (let member of foundUpdatedChannel.members) {
      emitingRemoveGroupMember(member.user_id, {
        channel_id: foundUpdatedChannel.channel_id,
        user_id,
      });
      if (!member.is_deleted) {
        emitNewMessage(member.user_id, foundUpdatedChannel);
      }
    }

    return res.status(200).json(foundUpdatedChannel);
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong!" });
  }
});

const seenChannel = asyncHandler(async (req, res) => {
  try {
    const { channel_id, user_id } = req.body;
    if (!channel_id || !user_id) {
      return res.status(400).json({ message: "All field are required!" });
    }

    const foundChannelMember = await prisma.userChannelMember.findMany({
      where: {
        channel_id,
        user_id,
      },
    });

    if (foundChannelMember?.length <= 0) {
      return res
        .status(500)
        .json({ message: "Failed to get channel members!" });
    }
    const updateUserSeen = await prisma.userChannelMember.update({
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
      return res.status(500).json({ message: "Something went wrong!" });
    }
    for await (let member of channel?.members) {
      emitingSeen(member.user_id, channel);
    }
    return res.status(200).json(channel);
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

    for await (let member of foundUpdatedChannel.members) {
      emitChangeGroupName(member.user_id, {
        channel_id: channelId,
        group_name: name,
      });
      emitNewMessage(member.user_id, foundUpdatedChannel);
    }
    return res.status(200).json({ data: foundUpdatedChannel });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong!" });
  }
});
export {
  createChannel,
  createGroupChannel,
  userChannels,
  getChannel,
  deleteChannel,
  channelMessages,
  sendMessage,
  addToGroup,
  removeFromChannel,
  seenChannel,
  changeGroupName,
};

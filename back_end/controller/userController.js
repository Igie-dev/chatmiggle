import asyncHandler from "express-async-handler";
import prisma from "../utils/prisma.js";

const getUsers = asyncHandler(async (req, res) => {
  const cursor = Number(req.query.cursor);
  const take = req.query.take;

  try {
    const query = {
      orderBy: {
        id: "asc",
      },
      select: {
        id: 4,
        user_id: true,
        first_name: true,
        last_name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    };
    if (Number(take) > 0) {
      query.take = Number(take);
    }
    if (cursor > 0) {
      query.cursor = {
        id: cursor,
      };
      query.skip = 1;
    }
    const users = await prisma.user.findMany(query);

    if (users?.length <= 0) {
      return res.status(404).json({ error: "No users found" });
    }
    const newCursor = users[users?.length - 1]?.id;
    return res.status(200).json({ cursor: newCursor, users: users });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
});

const getUser = asyncHandler(async (req, res) => {
  const user_id = req.params.id;

  try {
    const foundUser = await prisma.user.findUnique({
      where: { user_id },
      select: {
        id: true,
        user_id: true,
        first_name: true,
        last_name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
        avatar_id: true,
      },
    });

    if (!foundUser?.id) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json(foundUser);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
});

const updateUser = asyncHandler(async (req, res) => {
  const { user_id, first_name, last_name } = req.body;
  if (!user_id || !first_name || !last_name) {
    return res.status(400).json({ error: "All field are required" });
  }
  try {
    const update = await prisma.user.update({
      where: { user_id },
      data: { first_name, last_name },
    });

    if (!update?.id) {
      return res.status(500).json({ error: "Something went wrong" });
    }
    return res.status(200).json({ message: "Successfully updated user" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
});

const deleteUser = asyncHandler(async (req, res) => {
  const user_id = req.params.id;

  try {
    const foundUser = await prisma.user.findUnique({ where: { user_id } });

    if (!foundUser?.id) {
      return res.status(404).json({ error: "User not found" });
    }

    const deletedUser = await prisma.user.delete({ where: { user_id } });

    if (!deletedUser?.id) {
      return res.status(500).json({ error: "Something went wrong" });
    }
    return res.status(200).json({ message: "Successfully deleted user" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
});

const getUserFriends = asyncHandler(async (req, res) => {
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
      return res.status(404).json({ error: "No friends found" });
    }
    const userChannels = [];
    for await (const channel of foundUser?.membered_channel) {
      const existChannel = userChannels.filter(
        (c) => c.channel_id === channel.channel_id
      );
      if (existChannel.length <= 0) {
        const foundChannel = await prisma.channel.findUnique({
          where: { channel_id: channel.channel_id, is_private: true },
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
    }

    if (userChannels?.length <= 0) {
      return res.status(404).json({ error: "No friends found" });
    }

    userChannels?.sort(
      (a, b) => b.messages[0].createdAt - a.messages[0].createdAt
    );
    const mates = [];
    for (const channel of userChannels) {
      for (const channelMembers of channel.members) {
        if (channelMembers.user_id !== user_id) {
          mates.push(channelMembers);
        }
      }
    }

    if (mates?.length <= 0) {
      return res.status(404).json({ error: "No friends found" });
    }

    return res.status(200).json(mates);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
});
export { getUsers, updateUser, deleteUser, getUser, getUserFriends };

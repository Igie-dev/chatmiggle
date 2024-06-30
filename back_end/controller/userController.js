import asyncHandler from "express-async-handler";
import prisma from "../utils/prisma.js";
import { userDto, usersDto } from "../dto/userDto.js";
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
    return res.status(200).json({ cursor: newCursor, users: usersDto(users) });
  } catch (error) {
    return res.status(500).json({ error: "Something went wrong" });
  }
});

const getUser = asyncHandler(async (req, res) => {
  const userId = req.params.id;

  try {
    const foundUser = await prisma.user.findUnique({
      where: { user_id: userId },
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

    return res.status(200).json(userDto(foundUser));
  } catch (error) {
    return res.status(500).json({ error: "Something went wrong" });
  }
});

const updateUser = asyncHandler(async (req, res) => {
  const { userId, firstName, lastName } = req.body;
  if (!userId || !firstName || !lastName) {
    return res.status(400).json({ error: "All field are required" });
  }
  try {
    const update = await prisma.user.update({
      where: { user_id: userId },
      data: { first_name: firstName, last_name: lastName },
    });

    if (!update?.id) {
      return res.status(500).json({ error: "Something went wrong" });
    }
    return res.status(200).json({ message: "Successfully updated user" });
  } catch (error) {
    return res.status(500).json({ error: "Something went wrong" });
  }
});

const deleteUser = asyncHandler(async (req, res) => {
  const userId = req.params.id;

  try {
    const foundUser = await prisma.user.findUnique({
      where: { user_id: userId },
    });

    if (!foundUser?.id) {
      return res.status(404).json({ error: "User not found" });
    }

    const deletedUser = await prisma.user.delete({ where: { userId } });

    if (!deletedUser?.id) {
      return res.status(500).json({ error: "Something went wrong" });
    }
    return res.status(200).json({ message: "Successfully deleted user" });
  } catch (error) {
    return res.status(500).json({ error: "Something went wrong" });
  }
});

export { getUsers, updateUser, deleteUser, getUser };

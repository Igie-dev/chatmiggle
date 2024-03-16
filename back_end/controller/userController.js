import asyncHandler from "express-async-handler";
import prisma from "../lib/prisma.js";

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
			return res.status(404).json({ message: "No users found" });
		}
		const newCursor = users[users?.length - 1]?.id;
		return res.status(200).json({ cursor: newCursor, users: users });
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: "Something went wrong" });
	}
});

const updateUser = asyncHandler(async (req, res) => {
	const { user_id, first_name, last_name } = req.body;

	if (!user_id || !first_name || !last_name) {
		return res.status(400).json({ message: "All field are required" });
	}
	try {
		const update = await prisma.user.update({
			where: { user_id },
			data: { first_name, last_name },
		});

		if (!update?.id) {
			return res.status(500).json({ message: "Something went wrong" });
		}
		return res.status(200).json({ message: "Successfully updated user" });
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: "Something went wrong" });
	}
});

const deleteUser = asyncHandler(async (req, res) => {
	const user_id = req.params.id;

	try {
		const foundUser = await prisma.user.findUnique({ where: { user_id } });

		if (!foundUser?.id) {
			return res.status(404).json({ message: "User not found" });
		}

		const deletedUser = await prisma.user.delete({ where: { user_id } });

		if (!deletedUser?.id) {
			return res.status(500).json({ message: "Something went wrong" });
		}
		return res.status(200).json({ message: "Successfully deleted user" });
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: "Something went wrong" });
	}
});
export { getUsers, updateUser, deleteUser };

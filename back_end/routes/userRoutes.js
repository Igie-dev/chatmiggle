import express from "express";
import verifyJWT from "../middleware/verifyJWT.js";
import {
	getUsers,
	updateUser,
	deleteUser,
} from "../controller/userController.js";
const router = express.Router();
router.use(verifyJWT);

router.route("/").get(getUsers).patch(updateUser).delete(deleteUser);

export default router;

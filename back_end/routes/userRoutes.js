import express from "express";
import verifyJWT from "../middleware/verifyJWT.js";
import {
  getUsers,
  updateUser,
  deleteUser,
  getUser,
  getUserFriends,
} from "../controller/userController.js";
const router = express.Router();
router.use(verifyJWT);

router.route("/").get(getUsers).patch(updateUser);

router.route("/:id").get(getUser).delete(deleteUser);

router.route("/friends/:id").get(getUserFriends);

export default router;

import express from "express";
import verifyJWT from "../middleware/verifyJWT.js";
import {
  getUserChannels,
  verifyUserInChannel,
} from "../controller/channelController.js";
const router = express.Router();
router.use(verifyJWT);

router.route("/:id").get(getUserChannels);

router.route("/verifyuser/:channelId/:userId").get(verifyUserInChannel);
export default router;

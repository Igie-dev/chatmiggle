import express from "express";
import verifyJWT from "../middleware/verifyJWT.js";
import {
  createChannel,
  createGroupChannel,
  userChannels,
  getChannel,
  deleteChannel,
  channelMessages,
  sendMessage,
  addToGroup,
  seenChannel,
  changeGroupName,
  removeFromChannel,
} from "../controller/channelsController.js";
const router = express.Router();
router.use(verifyJWT);

router.route("/").post(createChannel);

router.route("/group").post(createGroupChannel);

router.route("/userchannel/:userId").get(userChannels);

router.route("/:channelId").get(getChannel);

router.route("/messages/:channelId").get(channelMessages);

router.route("/delete").delete(deleteChannel);

router.route("/newmessage").post(sendMessage);

router.route("/seen").post(seenChannel);

router.route("/group/changename").post(changeGroupName);

router.route("/group/add").post(addToGroup);

router.route("/group/remove").delete(removeFromChannel);

export default router;

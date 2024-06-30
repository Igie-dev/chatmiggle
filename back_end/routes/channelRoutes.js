import express from "express";
import verifyJWT from "../middleware/verifyJWT.js";

import {
  createChannel,
  userChannels,
  getChannel,
  deleteChannel,
  channelMessages,
  sendMessage,
  seenChannel,
  changeGroupName,
  removeFromChannel,
  requestJoinChannel,
  getChannelMembers,
  getChannelRequestJoin,
  acceptRequestChannelJoin,
} from "../controller/channelsController.js";

const router = express.Router();
router.use(verifyJWT);

router.route("/").post(createChannel);

router.route("/userchannel/:userId").get(userChannels);

router.route("/:channelId").get(getChannel);

router.route("/messages/:channelId").get(channelMessages);

router.route("/delete").delete(deleteChannel);

router.route("/newmessage").post(sendMessage);

router.route("/seen").post(seenChannel);

router.route("/group/changename").post(changeGroupName);

router.route("/group/remove").delete(removeFromChannel);

router.route("/requestjoin").post(requestJoinChannel);

router.route("/getmembers/:channelId").get(getChannelMembers);

router.route("/requestjoin/:channelId").get(getChannelRequestJoin);

router.route("/acceptjoinrequest").post(acceptRequestChannelJoin);
export default router;

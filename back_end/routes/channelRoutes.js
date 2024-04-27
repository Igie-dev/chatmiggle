import express from "express";
import verifyJWT from "../middleware/verifyJWT.js";
import {
  getUserChannels,
  verifyUserInChannel,
  getChannelMessages,
  getChannel,
  getUserGroups,
  getMembersChannel,
  addUserToGroupChanel,
  removeUserFromChannel,
} from "../controller/channelController.js";
const router = express.Router();
router.use(verifyJWT);

router.route("/userchannel/:userId").get(getUserChannels);

router.route("/usergroup/:userId").get(getUserGroups);

router.route("/:channelId").get(getChannel);

router.route("/verifyuser/:channelId/:userId").get(verifyUserInChannel);

router.route("/messages/:channelId").get(getChannelMessages);

router.route("/memberschannel").post(getMembersChannel);

router.route("/adduserchannel").post(addUserToGroupChanel);

router.route("/removeuser").patch(removeUserFromChannel);

export default router;

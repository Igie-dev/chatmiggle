import express from "express";
import {
  requestVerifyEmail,
  register,
} from "../controller/registerController.js";

const router = express.Router();

router.route("/getotp").post(requestVerifyEmail);
router.route("/").post(register);

export default router;

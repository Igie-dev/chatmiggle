import express from "express";
import loginLimiter from "../middleware/loginLimiter.js";

import { signIn, refresh, signOut } from "../controller/authController.js";

const router = express.Router();

router.route("/signin").post(loginLimiter, signIn);
router.route("/refresh").post(refresh);
router.route("/signout").post(signOut);

export default router;

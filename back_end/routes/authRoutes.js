import express from "express";
import loginLimiter from "../middleware/loginLimiter.js";

import { signIn, refresh, signOut } from "../controller/authController.js";

const router = express.Router();

router.route("/login").post(loginLimiter, signIn);
router.route("/refresh").get(refresh);
router.route("/signout").post(signOut);

export default router;

import express from "express";
import verifyJWT from "../middleware/verifyJWT.js";
import {
	uploadImage,
	uploadAvatar,
	getUerAvatar,
	deleteAvatar,
} from "../controller/imageController.js";
const router = express.Router();
// router.use(verifyJWT);

router
	.route("/uploadavatar/:id")
	.post(uploadImage.single("uploadavatar"), uploadAvatar);

router.route("/avatar/:id").get(getUerAvatar).delete(deleteAvatar);

export default router;

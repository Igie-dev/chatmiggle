import express from "express";
import verifyJWT from "../middleware/verifyJWT.js";
import {
  uploadImage,
  uploadAvatar,
  getAvatar,
  deleteAvatar,
} from "../controller/imageController.js";
const router = express.Router();
// router.use(verifyJWT);

router
  .route("/uploadavatar/:id")
  .post(uploadImage.single("uploadavatar"), uploadAvatar);

router.route("/avatar/:id").get(getAvatar).delete(deleteAvatar);

export default router;

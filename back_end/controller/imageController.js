import asyncHandler from "express-async-handler";
import prisma from "../lib/prisma.js";
import { v4 as uuid } from "uuid";
import dotenv from "dotenv";
dotenv.config();
import multer from "multer";
import { fileURLToPath } from "url";
import sharp from "sharp";
import fs from "fs";
import { promises as fsPromises } from "fs";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const acceptMimetype = ["image/jpeg", "image/png"];
const destinationPath = path.join(__dirname, "..", "uploads");

const imageData = {
  fileName: "",
  filePath: "",
  mimetype: "",
};

const storageFiles = multer.diskStorage({
  destination: async (req, file, cb) => {
    try {
      if (!fs.existsSync(destinationPath)) {
        await fsPromises.mkdir(destinationPath);
      }
      cb(null, destinationPath);
    } catch (err) {
      console.log(err);
      cb(err, null);
    }
  },
  filename: (req, file, cb) => {
    const customName = `${Math.round(
      Math.random() * 5000
    )}${uuid()}${path.extname(file.originalname)}`;
    const filePath = `${destinationPath}/${customName}`;
    imageData.fileName = file.originalname;
    imageData.filePath = filePath;
    imageData.mimetype = file.mimetype;

    cb(null, customName);
  },
  fileFilter: (req, file, cb) => {
    if (
      !file.originalname.match(/\.(jpg|jpeg|png)$/i) ||
      !acceptMimetype.includes(file.mimetype)
    ) {
      return cb(new Error("Only .docx and .pdf files are allowed!"));
    }
    cb(null, true);
  },
});

const uploadImage = multer({
  limits: {
    fieldSize: 2024 * 2024 * 3,
  },
  storage: storageFiles,
  onError: function (err, next) {
    console.log(err);
    fs.unlink(`${imageData.filePath}`, function (err) {
      if (err) {
        console.log(err);
      }
    });
    return res.status(500).json({ message: "Failed to upload files!" });
  },
});

///Resize image using Sharp
const resizeImage = async (fileLoc) => {
  const resizedImage = await sharp(fs.readFileSync(`${fileLoc}`))
    .resize(2000, 2000, { withoutEnlargement: true, fit: "inside" })
    .withMetadata()
    .jpeg({ quality: 80 })
    .toBuffer();
  return resizedImage;
};

//Convert to link
const bufferToDataURL = (buffer, mimetype) => {
  const base64String = buffer.toString("base64");
  return `data:${mimetype};base64,${base64String}`;
};

const uploadAvatar = asyncHandler(async (req, res) => {
  const id = req.params.id;

  function deleteFile() {
    if (fs.existsSync(imageData.filePath)) {
      fs.unlink(`${imageData.filePath}`, function (err) {
        if (err) {
          console.log(err);
        }
      });
    }
  }
  const resizedImage = await resizeImage(imageData.filePath);
  try {
    const foundUser = await prisma.user.findUnique({
      where: { user_id: id },
      select: { id: true, user_id: true, avatar_id: true },
    });

    if (foundUser?.id) {
      if (foundUser?.avatar_id) {
        updateExistAvatar(foundUser?.avatar_id, false);
      } else {
        saveAvatarIfNotExists(foundUser?.user_id, false);
      }
    }

    const foundChannel = await prisma.channel.findUnique({
      where: { channel_id: id },
      select: { id: true, channel_id: true, avatar_id: true },
    });

    if (foundChannel?.id) {
      if (foundChannel?.avatar_id) {
        updateExistAvatar(foundChannel?.avatar_id, true);
      } else {
        saveAvatarIfNotExists(foundChannel?.channel_id, true);
      }
    }

    //?helpers
    async function updateExistAvatar(avatarId, isGroup) {
      try {
        if (isGroup) {
          const updateAvatar = await prisma.avatar.update({
            where: { group_avatar_id: avatarId },
            data: {
              data: resizedImage,
              mimetype: imageData.mimetype,
            },
          });
          if (!updateAvatar?.id) {
            return res.status(500).json({ message: "Something went wrong" });
          }
          deleteFile();
          return res.status(201).json({ message: "Upload success" });
        } else {
          const updateAvatar = await prisma.avatar.update({
            where: { user_avatar_id: avatarId },
            data: {
              data: resizedImage,
              mimetype: imageData.mimetype,
            },
          });

          if (!updateAvatar?.id) {
            return res.status(500).json({ message: "Something went wrong" });
          }
          deleteFile();
          return res.status(201).json({ message: "Upload success" });
        }
      } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Something went wrong" });
      }
    }

    async function saveAvatarIfNotExists(id, isGroup) {
      try {
        if (isGroup) {
          const newId = uuid();

          await prisma.channel.update({
            where: { channel_id: id },
            data: {
              avatar_id: newId,
            },
          });

          const saveImage = await prisma.avatar.create({
            data: {
              group_avatar_id: newId,
              data: resizedImage,
              mimetype: imageData.mimetype,
            },
          });

          if (!saveImage?.id) {
            return res.status(500).json({ message: "Something went wrong" });
          }
          deleteFile();
          return res.status(201).json({ message: "Upload success" });
        } else {
          const newId = uuid();
          await prisma.user.update({
            where: { user_id: id },
            data: {
              avatar_id: newId,
            },
          });
          const saveImage = await prisma.avatar.create({
            data: {
              user_avatar_id: newId,
              data: resizedImage,
              mimetype: imageData.mimetype,
            },
          });

          if (!saveImage?.id) {
            return res.status(500).json({ message: "Something went wrong" });
          }
          deleteFile();
          return res.status(201).json({ message: "Upload success" });
        }
      } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Something went wrong" });
      }
    }
    //?

    if (!foundChannel?.id && !foundUser?.id) {
      return res.status(404).json({ message: "User or Channel not found" });
    }
  } catch (error) {
    deleteFile();
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
});

const getAvatar = asyncHandler(async (req, res) => {
  const id = req.params.id;
  console.log(id);
  try {
    const foundUserAvatar = await prisma.avatar.findUnique({
      where: {
        user_avatar_id: id,
      },
    });
    const foundGroupAvatar = await prisma.avatar.findUnique({
      where: {
        group_avatar_id: id,
      },
    });

    if (!foundUserAvatar?.id && !foundGroupAvatar?.id) {
      return res.status(404).json({ message: "Avatar not found" });
    }

    if (foundGroupAvatar?.id) {
      returnLink(foundGroupAvatar);
    }
    if (foundUserAvatar?.id) {
      returnLink(foundUserAvatar);
    }

    function returnLink(foundImage) {
      const buffer = Buffer.from(foundImage?.data, "binary");
      const url = bufferToDataURL(buffer, foundImage?.mimetype);
      return res.status(200).json({ url: url });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
});

const deleteAvatar = asyncHandler(async (req, res) => {
  const id = req.params.id;
  try {
    const foundAvatar = await prisma.avatar.findUnique({
      where: { avatar_id: id },
      select: { id: true },
    });

    if (!foundAvatar?.id) {
      return res.status(404).json({ message: "Avatar not found" });
    }

    const deleteAvatar = await prisma.avatar.delete({
      where: { avatar_id: id },
    });

    if (!deleteAvatar?.id) {
      return res.status(500).json({ message: "Something went wrong" });
    }
    return res.status(200).json({ message: "Avatar removed" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
});
export { uploadImage, uploadAvatar, getAvatar, deleteAvatar };

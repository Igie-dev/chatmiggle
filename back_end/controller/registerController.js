import asyncHandler from "express-async-handler";
import prisma from "../lib/prisma.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { v4 as uuid } from "uuid";
import { dateNow, formatDate } from "../lib/formatDate.js";
import otpEmail from "../lib/otpMailer.js";
const saltRounds = Number(process.env.SALTROUND);

const requestVerifyEmail = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: "All field are required!" });
  }
  try {
    const foundDuplicateEmail = await prisma.user.findUnique({
      where: { email },
    });

    if (foundDuplicateEmail?.id) {
      return res
        .status(409)
        .json({ message: "This email already has an account" });
    }

    const foundOtpExist = await prisma.otp.findUnique({ where: { email } });

    if (foundOtpExist?.id) {
      await prisma.otp.delete({ where: { email } });
    }

    const generateOtp = crypto.randomInt(100000, 999999).toString();
    const hashedOtp = await bcrypt.hash(generateOtp, saltRounds);
    const createOtp = await prisma.otp.create({
      data: {
        otp: hashedOtp,
        email,
      },
    });

    //send email
    await otpEmail(createOtp?.email, generateOtp);

    return res.status(200).json({
      email,
      message: "Otp sent",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
});

const register = asyncHandler(async (req, res) => {
  const { first_name, last_name, email, password, otp } = req.body;

  if (!first_name || !last_name || !email || !password || !otp) {
    return res.status(400).json({ message: "All field are required!" });
  }
  try {
    const foundOtpExist = await prisma.otp.findUnique({ where: { email } });

    if (!foundOtpExist?.id) {
      return res.status(400).json({ message: "Invalid provided otp" });
    }

    const compareOtp = await bcrypt.compare(otp, foundOtpExist?.otp);

    if (!compareOtp) {
      return res.status(400).json({ message: "Invalid Otp!" });
    }

    const today = dateNow();
    const otpDate = formatDate(foundOtpExist?.createdAt);

    const isExpired =
      (today.getDate() !== otpDate.getDate()) |
      (today.getMinutes() > otpDate.getMinutes() + 5);

    if (isExpired) {
      return res
        .status(400)
        .json({ message: "Otp expired! Please try again!" });
    }

    const decriptPass = await bcrypt.hash(password, Number(saltRounds));

    const generatedRandomId = `${crypto
      .randomInt(100000, 999999)
      .toString()}${first_name.slice(0, 2).toUpperCase()}${last_name
      .slice(0, 2)
      .toUpperCase()}${Math.floor(Math.random() * 100000)}`;

    const createUser = await prisma.user.create({
      data: {
        user_id: generatedRandomId,
        first_name,
        last_name,
        email,
        password: decriptPass,
      },
    });

    if (!createUser?.id) {
      return res.status(500).json({ message: "Something went wrong" });
    }

    await prisma.otp.delete({ where: { email } });
    return res.status(201).json({ email, message: "Registered" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
});

export { requestVerifyEmail, register };

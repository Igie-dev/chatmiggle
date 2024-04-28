import asyncHandler from "express-async-handler";
import prisma from "../lib/prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const audience = process.env.CLIENT_URL;
const issuer = process.env.SERVER_URL;

const signIn = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email | !password) {
    return res.status(400).json({ message: "Please provide all fields" });
  }

  try {
    const foundUser = await prisma.user.findUnique({ where: { email } });

    if (!foundUser?.id) {
      return res.status(401).json({ message: "Invalid login credintials" });
    }

    const isCorrectPass = await bcrypt.compare(password, foundUser?.password);

    if (!isCorrectPass) {
      return res.status(401).json({ message: "Invalid login credintials" });
    }

    const accessToken = jwt.sign(
      {
        User: {
          email: email,
          first_name: foundUser?.first_name,
          last_name: foundUser?.last_name,
          user_id: foundUser?.user_id,
        },
        aud: `${audience}`,
        iss: `${issuer}`,
      },
      process.env.ACCESS_TOKEN_SECRET
    );

    const refreshToken = jwt.sign(
      {
        user_id: foundUser?.user_id,
        aud: `${audience}`,
        iss: `${issuer}`,
      },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: "7d",
      }
    );
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.status(200).json({ accessToken });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
});

const refresh = asyncHandler(async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) {
    return res.status(401).json({ message: "Unauthorized!" });
  }
  try {
    const refreshToken = cookies.jwt;
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      async (error, decoded) => {
        if (error) {
          return res.status(403).json({ message: "Forbidden!" });
        }
        const userId = decoded.user_id;
        if (!userId) {
          return res.status(401).json({ message: "Unauthorized!" });
        }
        const foundUser = await prisma.user.findUnique({
          where: { user_id: userId },
        });
        if (!foundUser?.id) {
          res.clearCookie("jwt", {
            httpOnly: true,
            sameSite: "None",
            secure: true,
          });
          return res.status(401).json({ message: "Cookie cleared!" });
        }

        const accessToken = jwt.sign(
          {
            User: {
              email: foundUser?.email,
              first_name: foundUser?.first_name,
              last_name: foundUser?.last_name,
              user_id: foundUser?.user_id,
            },
            aud: `${audience}`,
            iss: `${issuer}`,
          },
          process.env.ACCESS_TOKEN_SECRET
        );
        return res.status(200).json({ accessToken });
      }
    );
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
});

const signOut = asyncHandler(async (req, res) => {
  try {
    const cookies = req.cookies;
    if (!cookies?.jwt) {
      return res.sendStatus(204);
    }
    res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
    return res.json({ message: "Cookie cleared!" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
});

export { signIn, refresh, signOut };

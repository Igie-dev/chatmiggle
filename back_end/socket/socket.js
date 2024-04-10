import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const audience = process.env.CLIENT_URL;
const issuer = process.env.SERVER_URL;

import createNewChannel from "./actions/newChannel.js";

//Config
const socketConnection = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: audience,
    },
  });

  //Middleware
  io.use(async (socket, next) => {
    const token = socket.handshake.auth.token;
    jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET,
      {
        ignoreExpiration: false,
        audience: `${audience}`,
        issuer: `${issuer}`,
      },
      (err, decoded) => {
        if (err) return;
        if (decoded.User.user_id) next();
      }
    );
  });

  //Connection
  io.on("connection", (socket) => {
    // console.log("Socket connnected");
    socket.on("user_join", async (user_id) => {
      socket.join(user_id);
    });

    socket.on("createNewChannel", ({ members, message, sender_id, type }) => {
      console.log(members, message, sender_id, type);
      createNewChannel({ members, message, sender_id, type })
        .then((res) => {
          if (res?.data) {
            members.forEach((m) => {
              io.to(m.user_id).emit("new_channel", {
                data: res.data,
              });
            });

            io.to(res?.data?.channel_id).emit("new_channel_message", {
              data: res.data,
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    });
  });
};

export default socketConnection;

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
    socket.on("user_join", (user_id) => {
      socket.join(user_id);
    });

    /// Active channel
    socket.on("active_channel", (channe_id) => {
      socket.join(channe_id);
    });

    //Listen for create new message on client
    //The event on front end when using the create private message
    socket.on(
      "create_new_channel",
      async ({ members, message, sender_id, type }) => {
        //This function return a promise and handle
        //the storing of message data on database
        //it return the data when it successfully saved
        createNewChannel({ members, message, sender_id, type })
          .then((res) => {
            if (res?.data) {
              //Emit all the members of the created private message
              members.forEach((m) => {
                io.to(m.user_id).emit("new_channel", {
                  data: res.data,
                });
              });
              //Send an emit to client where the channel id was listened
              socket.to(res?.data?.channel_id).emit("new_channel_message", {
                data: res.data,
              });
              //Return to sender
              io.to(socket.id).emit("create_new_channel", {
                data: res?.data?.channel_id,
              });
            }
          })
          .catch((err) => {
            console.log(err);
            //Return to sender
            io.to(socket.id).emit("create_new_channel", {
              error: "Somthing went wrong",
            });
          });
      }
    );
  });
};

export default socketConnection;

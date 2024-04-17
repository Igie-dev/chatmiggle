import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const audience = process.env.CLIENT_URL;
const issuer = process.env.SERVER_URL;

import createNewChannel from "./actions/newChannel.js";
import newChannelMessage from "./actions/newChannelMessage.js";
import seenControl from "./actions/seenControl.js";
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
    socket.on("active_channel", (channel_id) => {
      socket.join(channel_id);
    });

    // socket.on("listen_seen_channel", (channel_id) => {
    //   socket.join(channel_id);
    // });

    //Listen for create new private channel
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
              //The data is a whole channel with latest message
              //Emit all the members of the created private channel
              members.forEach((m) => {
                io.to(m.user_id).emit("channel_message", {
                  data: res.data,
                });
              });
              //Return to sender
              io.to(socket.id).emit("create_new_channel", {
                data: res?.data?.channel_id,
              });
            }
          })
          .catch((error) => {
            console.log(error);
            //Return to sender
            io.to(socket.id).emit("create_new_channel", {
              error: "Somthing went wrong",
            });
          });
      }
    );

    //New chat
    socket.on(
      "send_new_message",
      async ({ channel_id, sender_id, message, type }) => {
        newChannelMessage({ channel_id, sender_id, message, type })
          .then((res) => {
            if (res?.data) {
              //The data is a whole channel with latest message
              //Send an emit to client where the channel id was listened
              res.data?.members.forEach((m) => {
                io.to(m.user_id).emit("channel_message", {
                  data: res.data,
                });
              });

              io.to(res?.data?.channel_id).emit("new_message", {
                data: res.data,
              });

              io.to(socket.id).emit("send_new_message", {
                data: res?.data?.channel_id,
              });
            }
          })
          .catch((error) => {
            console.log(error);
            //Return to sender
            io.to(socket.id).emit("new_chat", {
              error: "Somthing went wrong",
            });
          });
      }
    );

    //Handle seen event

    socket.on("seen", async ({ channel_id, user_id }) => {
      seenControl({ channel_id, user_id })
        .then((res) => {
          if (res?.data) {
            io.to(socket.id).emit("seen", {
              data: res?.data,
            });
            res.data?.members.forEach((m) => {
              io.to(m.user_id).emit("message_seen", {
                data: res.data,
              });
            });
            io.to(res.data?.channel_id).emit("seen_channel", {
              data: res.data,
            });
          }
        })
        .catch((error) => {
          console.log(error);
          io.to(socket.id).emit("seen", {
            error: "Somthing went wrong",
          });
        });
    });
  });
};

export default socketConnection;

import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const audience = process.env.CLIENT_URL;
const issuer = process.env.SERVER_URL;

import createNewChannel from "./actions/newChannel.js";
import newChannelMessage from "./actions/newChannelMessage.js";
import seenControl from "./actions/seenControl.js";
import createNewGroup from "./actions/newGroup.js";
import removeFromGroup from "./actions/removeFromGroup.js";
import addToGroup from "./actions/addToGroup.js";
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
    //Listen for create new private channel
    //The event on front end when using the create private message
    socket.on(
      "create_new_channel",
      async ({ members, message, sender_id, type }) => {
        //This function return a promise and handle
        //the storing of message data on database
        //it return the data when it successfully saved
        createNewChannel({ members, message, sender_id, type })
          .then(async (res) => {
            if (res?.data) {
              //The data is a whole channel with latest message
              //Emit all the members of the created private channel
              //Return to sender
              io.to(socket.id).emit("create_new_channel", {
                data: res?.data?.channel_id,
              });
              for await (const member of members) {
                io.to(member.user_id).emit("channel_message", {
                  data: res.data,
                });
              }
            }
          })
          .catch((error) => {
            console.log(error);
            //Return to sender
            io.to(socket.id).emit("create_new_channel", {
              error: error.error,
            });
          });
      }
    );

    //New chat
    socket.on(
      "send_new_message",
      async ({ channel_id, sender_id, message, type }) => {
        newChannelMessage({ channel_id, sender_id, message, type })
          .then(async (res) => {
            if (res?.data) {
              //The data is a whole channel with latest message
              //Send an emit to client where the channel id was listened
              io.to(res?.data?.channel_id).emit("new_message", {
                data: res.data,
              });
              io.to(socket.id).emit("send_new_message", {
                data: res?.data?.channel_id,
              });
              const members = res.data?.members;
              if (members.length >= 1) {
                for await (const member of members) {
                  io.to(member.user_id).emit("channel_message", {
                    data: res.data,
                  });
                }
              }
            }
          })
          .catch((error) => {
            console.log(error);
            //Return to sender
            io.to(socket.id).emit("new_chat", {
              error: error.error,
            });
          });
      }
    );
    ///Handle Create group
    socket.on(
      "create_group",
      async ({ group_name, message, sender_id, type, members }) => {
        createNewGroup({ group_name, message, sender_id, type, members })
          .then(async (res) => {
            if (res?.data) {
              io.to(socket.id).emit("create_group", {
                data: res.data,
              });
              const members = res.data?.members;
              if (members.length >= 1) {
                for await (const member of members) {
                  io.to(member.user_id).emit("channel_message", {
                    data: res.data,
                  });
                }
              }
            }
          })
          .catch((error) => {
            io.to(socket.id).emit("create_group", {
              error: error.error,
            });
          });
      }
    );

    //Handle seen event
    socket.on("seen", async ({ channel_id, user_id }) => {
      seenControl({ channel_id, user_id })
        .then(async (res) => {
          if (res?.data) {
            io.to(socket.id).emit("seen", {
              data: res?.data,
            });
            io.to(res.data?.channel_id).emit("seen_channel", {
              data: res.data,
            });
            const members = res.data?.members;
            if (members.length >= 1) {
              for await (const member of members) {
                io.to(member.user_id).emit("message_seen", {
                  data: res.data,
                });
              }
            }
          }
        })
        .catch((error) => {
          io.to(socket.id).emit("seen", {
            error: error.error,
          });
        });
    });

    //Handle add user to group
    socket.on("add_to_group", async ({ user_id, channel_id }) => {
      addToGroup({ user_id, channel_id })
        .then(async (res) => {
          if (res?.data) {
            io.to(socket.id).emit("add_to_group", {
              data: res?.data,
            });
            const channelId = res.data?.channel_id;
            io.to(channelId).emit("new_message", {
              data: res.data,
            });
            const members = res.data?.members;
            if (members.length >= 1) {
              for await (const member of members) {
                io.to(member.user_id).emit("channel_message", {
                  data: res.data,
                });
                io.to(member.user_id).emit("add_member", {
                  data: res.data,
                });
              }
            }
          }
        })
        .catch((error) => {
          io.to(socket.id).emit("add_to_group", {
            error: error.error,
          });
        });
    });

    //Handle remove member from group
    socket.on("leave_group", async ({ user_id, channel_id, type }) => {
      removeFromGroup({ user_id, channel_id, type })
        .then(async (res) => {
          if (res?.data) {
            io.to(socket.id).emit("leave_group", {
              data: res?.data,
            });
            const channelId = res.data?.channel_id;
            io.to(channelId).emit("new_message", {
              data: res.data,
            });
            const members = res?.data?.members;

            if (members.length >= 1) {
              for await (const member of members) {
                if (member.is_deleted) {
                  io.to(member.user_id).emit("remove_channel", {
                    data: res.data,
                  });
                } else {
                  io.to(member.user_id).emit("channel_message", {
                    data: res.data,
                  });
                  io.to(member.user_id).emit("remove_member", {
                    data: res.data,
                  });
                }
              }
            }
          }
        })
        .catch((error) => {
          io.to(socket.id).emit("leave_group", {
            error: error.error,
          });
        });
    });
    //Handle delete group
    socket.on("delete_group", ({ user_id, channel }) => {
      const members = channel?.members;
      if (members.length >= 1) {
        for (const member of members) {
          io.to(member.user_id).emit("remove_channel", {
            data: channel,
          });
        }
      }
      io.to(socket.id).emit("delete_group", {
        data: channel,
      });
    });

    //Handle delete private channel
    socket.on("delete_channel", ({ user_id, channel }) => {
      io.to(user_id).emit("remove_channel", {
        data: channel,
      });
      io.to(user_id).emit("delete_channel", {
        data: channel,
      });
    });
  });
};

export default socketConnection;

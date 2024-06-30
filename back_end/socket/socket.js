import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import http from "http";
import express from "express";
dotenv.config();
const audience = process.env.CLIENT_URL;
const issuer = process.env.SERVER_URL;

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: audience,
    method: ["GET", "POST"],
  },
});

const getRecipentSocketId = (recipentId) => {
  return userSocketMap[recipentId];
};

const userSocketMap = {};

// //Middleware
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
      if (decoded.User.userId) next();
    }
  );
});

io.on("connection", (socket) => {
  const token = socket.handshake.auth.token;
  const userId = jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET,
    {
      ignoreExpiration: false,
      audience: `${audience}`,
      issuer: `${issuer}`,
    },
    (err, decoded) => {
      if (err) return;
      return decoded.User.userId;
    }
  );

  if (userId != "undefined") userSocketMap[userId] = socket.id;
  io.emit("onlineUsers", Object.keys(userSocketMap));
  socket.on("disconnect", () => {
    console.log("User disconnected");
    delete userSocketMap[userId];
    io.emit("onlineUsers", Object.keys(userSocketMap));
  });
});

const emitNewMessage = (receipent, data) => {
  const receipentSocketId = getRecipentSocketId(receipent);
  if (receipentSocketId) {
    io.to(receipentSocketId).emit("new_message", {
      data,
    });
  }
};

const emitChangeGroupName = (receipent, data) => {
  const receipentSocketId = getRecipentSocketId(receipent);
  if (receipentSocketId) {
    io.to(receipentSocketId).emit("change_group_name", {
      data,
    });
  }
};

const emitingRemoveGroupMember = (receipent, data) => {
  const receipentSocketId = getRecipentSocketId(receipent);
  if (receipentSocketId) {
    io.to(receipentSocketId).emit("remove_group_member", {
      data,
    });
  }
};

const emitingLeaveGroup = (receipent, data) => {
  const receipentSocketId = getRecipentSocketId(receipent);
  if (receipentSocketId) {
    io.to(receipentSocketId).emit("leave_channel", {
      data,
    });
  }
};

const emitingSeen = (receipent, data) => {
  const receipentSocketId = getRecipentSocketId(receipent);
  if (receipentSocketId) {
    io.to(receipentSocketId).emit("seen", {
      data,
    });
  }
};

export {
  getRecipentSocketId,
  emitNewMessage,
  emitChangeGroupName,
  emitingRemoveGroupMember,
  emitingLeaveGroup,
  emitingSeen,
  server,
  io,
  app,
};

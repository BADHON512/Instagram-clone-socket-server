import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import cors from "cors";

const port = 5000;
const app = express();
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  })
);

const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin:"*",
    methods: ["GET", "POST"],
    credentials: true,
  },
 
});

const users = {}; // for user store

io.on("connection", (socket) => {
  console.log("user connected", socket.id);

  socket.on("register", (userId) => {
    users[userId] = socket.id;
    console.log(`User ${userId} connected with socket ${socket.id}`);
  });
  socket.on("private_message", ({ senderId, receiverId, message }) => {
    const receiverSocketId = users[receiverId];

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("private_message", {
        senderId,
        receiverId,
        message,
      }); // ✅ receiverId পাঠাচ্ছি
      console.log(`Message sent from ${senderId} to ${receiverId}: ${message}`);
    } else {
      console.log(`User ${receiverId} is not online`);
    }
  });

  socket.on("disconnect", () => {
    Object.keys(users).forEach((userId) => {
      if (users[userId] === socket.id) {
        delete users[userId];
      }
    });
    console.log("user disconnected", socket.id);
  });
});

app.get("/", (req, res) => {
  res.send("<h1>hello world</h1>");
});
server.listen(port, () => {
  console.log(`server is running on port ${port}`);
});

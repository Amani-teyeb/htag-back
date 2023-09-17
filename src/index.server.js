const express = require("express");
const app = express();
const env = require("dotenv");
const mongoose = require("mongoose");
const connectDB = require("./config/connectDB");
const path = require("path");
const cors = require("cors");

app.use(cors());
env.config();
app.use(express.json());
app.use("/public", express.static(path.join(__dirname, "uploads")));

const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin/auth");
const themeRoutes = require("./routes/theme");
const courseRoutes = require("./routes/course");
const chatRoutes = require("./routes/chat");
const messageRoutes = require("./routes/message");
const mycourses = require("./routes/mycourse");

mongoose.set("strictQuery", false);
connectDB();

app.use("/api", authRoutes);
app.use("/api", adminRoutes);
app.use("/api", courseRoutes);
app.use("/api", themeRoutes);
app.use("/api", chatRoutes);
app.use("/api", messageRoutes);
app.use("/api", mycourses);

const server = app.listen(process.env.PORT, () => {
  console.log(`Server is running on PORT ${process.env.PORT}`);
});

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
  },
});
io.on("connection", (socket) => {
  console.log("connected to socket.io");

  socket.on("setup", async (chats) => {
    for (const chat of chats) {
      await socket.join(chat._id);
      socket.emit("connected", chat._id);
    }
  });

  socket.on("new message", (newMessageReceived) => {
    if (newMessageReceived && newMessageReceived.chat) {
      const { _id } = newMessageReceived.chat[0];
      socket.in(_id).emit("message received", newMessageReceived);
    }
  });

  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
});

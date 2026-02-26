// src/config/socket.js

const { Server } = require("socket.io");
const { initAttendanceSocket } = require("../sockets/attendance.socket");

let io;

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  initAttendanceSocket(io);

  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};

module.exports = { initSocket, getIO };
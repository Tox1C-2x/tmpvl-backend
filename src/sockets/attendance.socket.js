// src/sockets/attendance.socket.js

let ioInstance;

const initAttendanceSocket = (io) => {
  ioInstance = io;

  io.on("connection", (socket) => {
    console.log("🔌 New client connected:", socket.id);

    /**
     * Employee joins personal room
     * room name = emp_id
     */
    socket.on("join-room", (emp_id) => {
      socket.join(emp_id);
      console.log(`👤 Employee ${emp_id} joined room`);
    });

    /**
     * Admin joins admin room
     */
    socket.on("join-admin", () => {
      socket.join("admin");
      console.log("🛠 Admin joined room");
    });

    socket.on("disconnect", () => {
      console.log("❌ Client disconnected:", socket.id);
    });
  });
};

/**
 * Emit attendance update to specific employee
 */
const emitAttendanceUpdate = (emp_id, data) => {
  if (!ioInstance) return;
  ioInstance.to(emp_id).emit("attendance-update", data);
};

/**
 * Emit gate punch notification
 */
const emitGatePunch = (emp_id, data) => {
  if (!ioInstance) return;
  ioInstance.to(emp_id).emit("gate-punch", data);
};

/**
 * Broadcast to admin dashboard
 */
const emitToAdmin = (data) => {
  if (!ioInstance) return;
  ioInstance.to("admin").emit("admin-update", data);
};

module.exports = {
  initAttendanceSocket,
  emitAttendanceUpdate,
  emitGatePunch,
  emitToAdmin
};
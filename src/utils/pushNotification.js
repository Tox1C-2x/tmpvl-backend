// src/utils/pushNotification.js

const {
  emitAttendanceUpdate,
  emitGatePunch,
  emitToAdmin
} = require("../sockets/attendance.socket");

exports.notifyAttendance = (emp_id, message, extra = {}) => {
  emitAttendanceUpdate(emp_id, {
    message,
    ...extra,
    timestamp: new Date()
  });
};

exports.notifyGatePunch = (emp_id, message, extra = {}) => {
  emitGatePunch(emp_id, {
    message,
    ...extra,
    timestamp: new Date()
  });
};

exports.notifyAdmin = (data) => {
  emitToAdmin({
    ...data,
    timestamp: new Date()
  });
};
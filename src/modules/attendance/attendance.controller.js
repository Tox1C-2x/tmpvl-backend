// src/modules/attendance/attendance.controller.js

const service = require("./attendance.service");

exports.checkIn = async (req, res, next) => {
  try {
    const result = await service.checkIn(req.user.emp_id);
    res.json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
};

exports.checkOut = async (req, res, next) => {
  try {
    const result = await service.checkOut(req.user.emp_id);
    res.json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
};

exports.getMyAttendance = async (req, res, next) => {
  try {
    const data = await service.getAttendance(req.user.emp_id);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};
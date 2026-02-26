// src/modules/leave/leave.controller.js

const service = require("./leave.service");

exports.apply = async (req, res, next) => {
  try {
    const data = await service.applyLeave({
      emp_id: req.user.emp_id,
      ...req.body
    });

    res.status(201).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

exports.myLeaves = async (req, res, next) => {
  try {
    const data = await service.getMyLeaves(req.user.emp_id);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

exports.updateStatus = async (req, res, next) => {
  try {
    const { leave_id, status } = req.body;
    const data = await service.updateLeaveStatus(leave_id, status);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};
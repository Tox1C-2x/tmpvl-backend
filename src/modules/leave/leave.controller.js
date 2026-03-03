// src/modules/leave/leave.controller.js

const service = require("./leave.service");

exports.apply = async (req, res, next) => {
  try {

    const leave = await service.applyLeave({
      employee_id: req.user.employee_id,
      ...req.body
    });
console.log("USER:", req.user);
console.log("BODY:", req.body);
    res.json({ success: true, leave });

  } catch (err) {
    next(err);
  }
};


exports.myLeaves = async (req, res, next) => {
  try {

    const leaves = await service.getMyLeaves(req.user.employee_id);

    res.json({ success: true, leaves });

  } catch (err) {
    next(err);
  }
};


exports.updateStatus = async (req, res, next) => {
  try {

    const leave = await service.updateStatus({
      ...req.body,
      reviewed_by: req.user.employee_id
    });

    res.json({ success: true, leave });

  } catch (err) {
    next(err);
  }
};
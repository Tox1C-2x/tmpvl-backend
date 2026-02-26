// src/modules/salary/salary.controller.js

const service = require("./salary.service");

exports.generate = async (req, res, next) => {
  try {
    const { month, year } = req.body;
    const data = await service.generateSalary(
      req.user.emp_id,
      month,
      year
    );

    res.status(201).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

exports.mySalary = async (req, res, next) => {
  try {
    const data = await service.getMySalary(req.user.emp_id);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};
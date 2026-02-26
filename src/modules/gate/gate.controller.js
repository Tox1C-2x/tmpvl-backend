// src/modules/gate/gate.controller.js

const service = require("./gate.service");

exports.punch = async (req, res, next) => {
  try {
    const data = await service.punchGate({
      emp_id: req.user.emp_id,
      punch_type: req.body.punch_type,
      gate_id: req.body.gate_id,
      device_id: req.body.device_id
    });

    res.status(201).json({
      success: true,
      message: "Gate punch recorded",
      data
    });

  } catch (err) {
    next(err);
  }
};

exports.myPunches = async (req, res, next) => {
  try {
    const data = await service.getMyPunches(req.user.emp_id);

    res.json({
      success: true,
      data
    });

  } catch (err) {
    next(err);
  }
};

exports.punchByDate = async (req, res, next) => {
  try {
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ error: "Date is required (YYYY-MM-DD)" });
    }

    const data = await service.getPunchesByDate(
      req.user.emp_id,
      date
    );

    res.json({
      success: true,
      data
    });

  } catch (err) {
    next(err);
  }
};
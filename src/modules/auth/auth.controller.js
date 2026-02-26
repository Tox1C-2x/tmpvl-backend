// src/modules/auth/auth.controller.js

const service = require("./auth.service");

exports.register = async (req, res) => {
  try {
    const result = await service.register(req.body);
    res.json(result);
  } catch (err) {
    res.status(err.statusCode || 500).json({
      success: false,
      message: err.message
    });
  }
};

exports.verifyOTP = async (req, res) => {
  try {
    const result = await service.verifyOTP(req.body);
    res.json(result);
  } catch (err) {
    res.status(err.statusCode || 500).json({
      success: false,
      message: err.message
    });
  }
};

exports.setPassword = async (req, res) => {
  try {
    const result = await service.setPassword(req.body);
    res.json(result);
  } catch (err) {
    res.status(err.statusCode || 500).json({
      success: false,
      message: err.message
    });
  }
};

exports.login = async (req, res) => {
  try {
    const result = await service.login(req.body);
    res.json(result);
  } catch (err) {
    res.status(err.statusCode || 500).json({
      success: false,
      message: err.message
    });
  }
};
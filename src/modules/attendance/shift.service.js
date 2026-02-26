// src/modules/attendance/shift.service.js

exports.getShiftTiming = (shiftType) => {
  switch (shiftType) {
    case "morning":
      return { start: "09:00", end: "17:00" };
    case "evening":
      return { start: "14:00", end: "22:00" };
    case "night":
      return { start: "22:00", end: "06:00" };
    default:
      return { start: "09:00", end: "17:00" };
  }
};
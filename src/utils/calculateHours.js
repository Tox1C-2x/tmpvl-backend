// src/utils/calculateHours.js

exports.calculateHours = (checkIn, checkOut) => {
  const checkInTime = new Date(checkIn);
  const checkOutTime = new Date(checkOut);

  const diffMs = checkOutTime - checkInTime;

  if (diffMs <= 0) {
    return {
      totalHours: 0,
      overtimeHours: 0
    };
  }

  const totalHours = diffMs / (1000 * 60 * 60);

  // 8 hours standard shift
  const overtimeHours = totalHours > 8 ? totalHours - 8 : 0;

  return {
    totalHours: parseFloat(totalHours.toFixed(2)),
    overtimeHours: parseFloat(overtimeHours.toFixed(2))
  };
};
// src/utils/monthHelper.js

exports.getCurrentMonthYear = () => {
  const now = new Date();
  return {
    month: now.getMonth() + 1,
    year: now.getFullYear()
  };
};

exports.getMonthName = (monthNumber) => {
  const months = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];

  return months[monthNumber - 1] || "Invalid Month";
};

exports.getMonthStartEnd = (month, year) => {
  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 0);

  return {
    startDate: start.toISOString().split("T")[0],
    endDate: end.toISOString().split("T")[0]
  };
};
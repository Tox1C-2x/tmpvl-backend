
// src/modules/salary/salary.controller.js

const service = require("./salary.service");
const pdfService = require("./pdf.service");

/* ================= GENERATE SALARY ================= */
exports.generate = async (req, res, next) => {
  try {
    const { month, year } = req.body;
    if (!month || !year) {
      return res.status(400).json({ success: false, message: "Month and Year are required" });
    }

    const employeeId = req.user.employee_id;
    const existing = await service.getSalaryByMonth(employeeId, month, year);

    if (existing) {
      return res.status(409).json({ success: false, message: "Salary already generated" });
    }

    const data = await service.generateSalary(employeeId, month, year);
    return res.status(201).json({ success: true, message: "Generated successfully", data });
  } catch (err) {
    next(err);
  }
};

/* ================= GET MY SALARY ================= */
exports.mySalary = async (req, res, next) => {
  try {
    const employeeId = req.user.employee_id;
    const data = await service.getMySalary(employeeId);
    return res.json({ success: true, count: data.length, data });
  } catch (err) {
    next(err);
  }
};

/* ================= DOWNLOAD PDF ================= */
exports.downloadPDF = async (req, res, next) => {
  try {
    const { id } = req.params;
    const employeeId = req.user.employee_id;

    // Database se data lana with Employee Details
    const salary = await service.getSalaryById(id, employeeId);

    if (!salary) {
      return res.status(404).json({ success: false, message: "Salary record not found" });
    }

    // PDF Service ke liye data format karna
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const pdfData = {
      name: salary.full_name || "Employee",
      bankName: salary.bank_name || "N/A",
      bankAcNo: salary.account_no || "N/A",
      pan: salary.pan || "N/A",
      payPeriod: `${monthNames[salary.month - 1]} ${salary.year}`,
      employee_id: salary.employee_id,
      grossSalary: `INR ${Number(salary.gross_salary).toLocaleString('en-IN')}`,
      netPay: `INR ${Number(salary.net_salary).toLocaleString('en-IN')}`,
      totalPayments: Number(salary.gross_salary).toLocaleString('en-IN'),
      totalDeductions: Number(salary.total_deductions).toLocaleString('en-IN'),
      payments: [
        { desc: "Basic Salary", amount: Number(salary.basic_salary).toLocaleString('en-IN') },
        { desc: "Overtime Allowance", amount: Number(salary.overtime_allowance).toLocaleString('en-IN') }
      ],
      deductions: [
        { desc: "Total Deductions", amount: Number(salary.total_deductions).toLocaleString('en-IN') }
      ],
      taxationMethod: "NEW REGIME",
      daysInMonth: "30",
      monthDaysPaid: "30",
      daysNotPaid: "0"
    };

    // PDF generate karke direct response stream mein bhejna
    pdfService.generateSalaryPDF(res, pdfData);
  } catch (err) {
    next(err);
  }
};
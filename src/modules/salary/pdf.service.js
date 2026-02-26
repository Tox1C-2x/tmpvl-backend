// src/modules/salary/pdf.service.js

const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

exports.generateSalaryPDF = (salaryData) => {
  const doc = new PDFDocument();
  const filePath = path.join("uploads", `salary_${salaryData.id}.pdf`);

  doc.pipe(fs.createWriteStream(filePath));

  doc.fontSize(18).text("Salary Slip", { align: "center" });
  doc.moveDown();

  doc.fontSize(12).text(`Employee ID: ${salaryData.emp_id}`);
  doc.text(`Month: ${salaryData.month}/${salaryData.year}`);
  doc.text(`Basic Salary: ₹${salaryData.basic_salary}`);
  doc.text(`Overtime: ₹${salaryData.overtime_allowance}`);
  doc.text(`Gross Salary: ₹${salaryData.gross_salary}`);
  doc.text(`Deductions: ₹${salaryData.total_deductions}`);
  doc.text(`Net Salary: ₹${salaryData.net_salary}`);

  doc.end();

  return filePath;
};
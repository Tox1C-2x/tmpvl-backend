// src/modules/salary/pdf.service.js

const PDFDocument = require("pdfkit");

exports.generateSalaryPDF = (res, data) => {
  const doc = new PDFDocument({ size: "A4", margin: 30 });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=salary-slip-${data.payPeriod}.pdf`
  );

  doc.pipe(res);

  /* ================= HEADER ================= */

  doc
    .fontSize(22)
    .fillColor("#003DA5")
    .text("TATA MOTORS", 30, 30);

  doc
    .fontSize(12)
    .fillColor("black")
    .text(
      "TATA MOTORS PASSENGER VEHICLES LIMITED",
      350,
      35,
      { align: "right" }
    );

  doc.moveTo(30, 65).lineTo(565, 65).stroke();

  /* ================= EMPLOYEE INFO TABLE ================= */

  let y = 75;

  const row = (label, value, x1, x2) => {
    doc.fontSize(10).text(label, x1, y);
    doc.text(value, x2, y);
  };

  row("Name:", data.name, 30, 80);
  row("Bank Code:", data.bankCode, 250, 320);
  row("Payslip No:", data.payslipNo, 430, 500);
  y += 15;

  row("Pers No:", data.employee_id, 30, 80);
  row("Bank Name:", data.bankName, 250, 320);
  row("Pay Period:", data.payPeriod, 430, 500);
  y += 15;

  row("Emp Id:", data.employee_id, 30, 80);
  row("PAN:", data.pan, 430, 470);
  y += 15;

  row("Cost Center:", data.costCent, 30, 100);
  row("Bank A/C:", data.bankAcNo, 250, 320);
  row("Aadhar:", data.aadhar, 430, 490);
  y += 15;

  row("Level:", data.level, 30, 80);
  row("Emp Group:", data.empGroup, 250, 330);
  row("UAN:", data.uan, 430, 470);
  y += 20;

  /* ================= PAYMENTS + DEDUCTIONS BOX ================= */

  const boxTop = y;
  const boxHeight = 150;

  doc.rect(30, boxTop, 505, boxHeight).stroke();
  doc.moveTo(282, boxTop).lineTo(282, boxTop + boxHeight).stroke();

  doc.fontSize(11).text("Payments", 40, boxTop + 5);
  doc.text("Deductions", 300, boxTop + 5);

  let py = boxTop + 25;

  data.payments.forEach(p => {
    doc.fontSize(10).text(p.desc, 40, py);
    doc.text(p.amount, 200, py, { align: "right", width: 60 });
    py += 15;
  });

  let dy = boxTop + 25;

  data.deductions.forEach(d => {
    doc.fontSize(10).text(d.desc, 300, dy);
    doc.text(d.amount, 470, dy, { align: "right", width: 60 });
    dy += 15;
  });

  y = boxTop + boxHeight;

  /* ================= TOTAL SECTION ================= */

  doc.rect(30, y, 505, 30).stroke();
  doc.moveTo(282, y).lineTo(282, y + 30).stroke();

  doc.fontSize(11).text("Total Payments", 40, y + 8);
  doc.text(data.totalPayments, 200, y + 8, { align: "right", width: 60 });

  doc.text("Total Deductions", 300, y + 8);
  doc.text(data.totalDeductions, 470, y + 8, { align: "right", width: 60 });

  y += 30;

  /* ================= PROJECTION + NET PAY ================= */

  doc.rect(30, y, 505, 80).stroke();
  doc.moveTo(350, y).lineTo(350, y + 80).stroke();

  let projY = y + 10;

  doc.fontSize(10).text("Projection for Financial Year", 40, projY);
  projY += 15;

  doc.text("Taxation Method: " + data.taxationMethod, 40, projY);
  projY += 12;
  doc.text("Gross Salary: " + data.grossSalary, 40, projY);
  projY += 12;
  doc.text("Aggr Dedn: " + data.aggrDedn, 40, projY);
  projY += 12;
  doc.text("Total Income: " + data.totalIncome, 40, projY);

  doc.fontSize(12).text("Net Pay", 370, y + 15);
  doc.fontSize(14).text(data.netPay, 370, y + 35);

  y += 80;

  /* ================= ATTENDANCE TABLE ================= */

  doc.rect(30, y, 505, 70).stroke();

  doc.fontSize(10).text("Attendance / Leave", 40, y + 5);

  doc.text("Days in Month: " + data.daysInMonth, 40, y + 25);
  doc.text("Days Paid: " + data.monthDaysPaid, 200, y + 25);
  doc.text("Days Not Paid: " + data.daysNotPaid, 350, y + 25);

  y += 70;

  /* ================= FOOTER ================= */

  doc.fontSize(9)
    .fillColor("gray")
    .text(
      "This is an electronically generated statement.",
      30,
      y + 15,
      { align: "center", width: 505 }
    );

  doc.end();
};
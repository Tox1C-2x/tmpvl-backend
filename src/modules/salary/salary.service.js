// src/modules/salary/salary.service.js

const pool = require("../../config/db");

exports.generateSalary = async (emp_id, month, year) => {
  const attendance = await pool.query(
    `SELECT SUM(total_hours) as total_hours,
            SUM(overtime_hours) as overtime
     FROM attendance
     WHERE emp_id=$1
     AND EXTRACT(MONTH FROM attendance_date)=$2
     AND EXTRACT(YEAR FROM attendance_date)=$3`,
    [emp_id, month, year]
  );

  const totalHours = parseFloat(attendance.rows[0].total_hours) || 0;
  const overtime = parseFloat(attendance.rows[0].overtime) || 0;

  const basic_salary = 20000;
  const overtime_allowance = overtime * 200;

  const gross_salary = basic_salary + overtime_allowance;
  const total_deductions = gross_salary * 0.1;
  const net_salary = gross_salary - total_deductions;

  const result = await pool.query(
    `INSERT INTO salary_slips
     (emp_id, month, year, basic_salary, overtime_allowance,
      gross_salary, total_deductions, net_salary)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
     RETURNING *`,
    [
      emp_id,
      month,
      year,
      basic_salary,
      overtime_allowance,
      gross_salary,
      total_deductions,
      net_salary
    ]
  );

  return result.rows[0];
};

exports.getMySalary = async (emp_id) => {
  const result = await pool.query(
    `SELECT * FROM salary_slips
     WHERE emp_id=$1
     ORDER BY year DESC, month DESC`,
    [emp_id]
  );

  return result.rows;
};
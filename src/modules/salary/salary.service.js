// src/modules/salary/salary.service.js

const pool = require("../../config/db");

/* ================= GENERATE SALARY ================= */

exports.generateSalary = async (employee_id, month, year) => {

  const attendance = await pool.query(
    `SELECT 
        SUM(total_hours) as total_hours, 
        SUM(overtime_hours) as overtime
     FROM tmpvl.attendance 
     WHERE employee_id=$1 
     AND EXTRACT(MONTH FROM attendance_date)=$2 
     AND EXTRACT(YEAR FROM attendance_date)=$3`,
    [employee_id, month, year]
  );

  const overtime = parseFloat(attendance.rows[0]?.overtime) || 0;

  const basic_salary = 20000;
  const overtime_allowance = overtime * 200;

  const gross_salary = basic_salary + overtime_allowance;
  const total_deductions = gross_salary * 0.1;
  const net_salary = gross_salary - total_deductions;

  const result = await pool.query(
    `INSERT INTO tmpvl.salary_slips
     (employee_id, month, year, basic_salary, overtime_allowance, 
      gross_salary, total_deductions, net_salary)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
     RETURNING *`,
    [
      employee_id,
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


/* ================= GET ALL SALARIES ================= */

exports.getMySalary = async (employee_id) => {

  const result = await pool.query(
    `SELECT *
     FROM tmpvl.salary_slips
     WHERE employee_id=$1
     ORDER BY year DESC, month DESC`,
    [employee_id]
  );

  return result.rows;
};


/* ================= GET SALARY BY MONTH ================= */

exports.getSalaryById = async (id, employee_id) => {
  const result = await pool.query(
    `SELECT s.*, u.full_name, u.bank_name, u.account_no, u.pan
     FROM tmpvl.salary_slips s
     JOIN tmpvl.users u
       ON s.employee_id = u.employee_id
     WHERE s.id = $1
     AND s.employee_id = $2`,
    [id, employee_id]
  );

  return result.rows[0];
};
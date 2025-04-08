const express = require('express');
const router = express.Router();
const pool = require('../db');

// 🧑 Employee Dashboard – Get Details by ID
router.get('/dashboard/:id', async (req, res) => {
  const empId = req.params.id;

  try {
    const employee = await pool.query('SELECT * FROM employees WHERE employee_id = $1', [empId]);
    const salary = await pool.query('SELECT * FROM salaries WHERE employee_id = $1', [empId]);
    const payroll = await pool.query('SELECT * FROM payroll WHERE employee_id = $1', [empId]);
    const attendance = await pool.query('SELECT * FROM attendance WHERE employee_id = $1', [empId]);

    if (employee.rowCount === 0) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    res.json({
      success: true,
      employee: employee.rows[0],
      salary: salary.rows[0],
      payroll: payroll.rows,
      attendance: attendance.rows,
    });
  } catch (error) {
    console.error('Dashboard fetch error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

module.exports = router;
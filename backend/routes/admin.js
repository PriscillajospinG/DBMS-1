const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/employees', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM employees');
    res.json({ success: true, employees: result.rows });
  } catch (err) {
    console.error('Error fetching employees:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ✏️ Update employee
router.put('/employees/:employee_id', async (req, res) => {
    const { employee_id } = req.params;
    const {
      employee_name,
      department,
      position,
      hire_date,
      base_salary,
      password
    } = req.body;
  
    try {
      const result = await pool.query(
        `UPDATE employees
         SET employee_name = $1,
             department = $2,
             position = $3,
             hire_date = $4,
             base_salary = $5,
             password = $6
         WHERE employee_id = $7`,
        [employee_name, department, position, hire_date, base_salary, password, employee_id]
      );
  
      if (result.rowCount === 0) {
        return res.status(404).json({ success: false, message: 'Employee not found' });
      }
  
      res.json({ success: true, message: 'Employee updated successfully' });
    } catch (error) {
      console.error('Update employee error:', error);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  });

// ➕ Add an employee
router.post('/employees', async (req, res) => {
    const {
      employee_id,
      employee_name,
      department,
      position,
      hire_date,
      base_salary,
      password
    } = req.body;
  
    try {
      await pool.query(
        `INSERT INTO employees (
          employee_id, employee_name, department, position, hire_date, base_salary, password
        ) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [employee_id, employee_name, department, position, hire_date, base_salary, password]
      );
  
      res.json({ success: true, message: 'Employee added successfully' });
    } catch (error) {
      console.error('Add employee error:', error);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  });

// ✏️ Update base salary
router.put('/salary/:id', async (req, res) => {
  const empId = req.params.id;
  const { base_salary } = req.body;

  try {
    await pool.query(
      'UPDATE salaries SET base_salary = $1 WHERE employee_id = $2',
      [base_salary, empId]
    );
    res.json({ success: true, message: 'Base salary updated' });
  } catch (error) {
    console.error('Update salary error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// ❌ Delete employee
router.delete('/employees/:employee_id', async (req, res) => {
    const { employee_id } = req.params;
  
    try {
      // Delete from child tables first to prevent FK violations
      await pool.query('DELETE FROM salaries WHERE employee_id = $1', [employee_id]);
      await pool.query('DELETE FROM payroll WHERE employee_id = $1', [employee_id]);
      await pool.query('DELETE FROM attendance WHERE employee_id = $1', [employee_id]);
      await pool.query('DELETE FROM employee_login WHERE employee_id = $1', [employee_id]);
  
      // Delete from employees table
      const result = await pool.query('DELETE FROM employees WHERE employee_id = $1', [employee_id]);
  
      if (result.rowCount === 0) {
        return res.status(404).json({ success: false, message: 'Employee not found' });
      }
  
      res.json({ success: true, message: 'Employee deleted successfully' });
    } catch (error) {
      console.error('Delete employee error:', error);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  });

// ✅ Mark Attendance
router.post('/attendance/:employee_id', async (req, res) => {
    const { employee_id } = req.params;
    const { status } = req.body;
  
    try {
      const query = `
        INSERT INTO attendance (employee_id, attendance_date, status)
        VALUES ($1, CURRENT_DATE, $2)
        ON CONFLICT (employee_id, attendance_date)
        DO UPDATE SET status = EXCLUDED.status
      `;
      await pool.query(query, [employee_id, status]);
  
      res.status(200).json({ message: 'Attendance marked' });
    } catch (err) {
      console.error('Error marking attendance:', err.message);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

module.exports = router;
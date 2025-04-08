// backend/routes/auth.js
const express = require('express');
const router = express.Router();
const pool = require('../db'); // or wherever your DB pool is

// 🧑 Employee Login
router.post('/login/employee', async (req, res) => {
  const { employee_id, password } = req.body;

  try {
    const result = await pool.query(
      'SELECT * FROM employee_login WHERE employee_id = $1 AND password = $2',
      [employee_id, password]
    );

    if (result.rows.length === 1) {
      res.json({ success: true, message: 'Login successful', employee_id });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Employee login error:', error); // <== this will show real issue
    res.status(500).json({ success: false, message: 'Server error. Please try again later.' });
  }
});

// 👨‍💼 Admin Login
router.post('/login/admin_dashboard', async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await pool.query(
      'SELECT * FROM admin_login WHERE username = $1 AND password = $2',
      [username, password]
    );

    if (result.rowCount > 0) {
      res.json({ success: true, message: 'Admin login successful' });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
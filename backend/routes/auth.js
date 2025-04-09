// backend/routes/auth.js
const express = require('express');
const router = express.Router();
const pool = require('../db'); // or wherever your DB pool is

// 🧑 Employee Login
router.post("/login/employee", async (req, res) => {
  try {
    const { employee_id, password } = req.body;

    // ✅ Add this validation
    if (!employee_id || isNaN(parseInt(employee_id))) {
      return res.status(400).json({ success: false, message: "Invalid Employee ID" });
    }

    const result = await pool.query(
      'SELECT * FROM employee_login WHERE employee_id = $1 AND password = $2',
      [parseInt(employee_id), password]
    );

    if (result.rows.length > 0) {
      res.json({ success: true, employee_id });
    } else {
      res.status(401).json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.error("Employee login error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// 👨‍💼 Admin Login
router.post('/login/admin', async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await pool.query(
      'SELECT * FROM admin_login WHERE username = $1 AND password = $2',
      [username, password]
    );

    if (result.rows.length > 0) {
      res.json({ success: true });
    } else {
      res.json({ success: false, message: 'Invalid credentials' });
    }
  } catch (err) {
    console.error('Admin login error:', err);  // <== this should print error in terminal
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
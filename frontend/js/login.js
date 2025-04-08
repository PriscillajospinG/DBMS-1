document.getElementById('loginForm').addEventListener('submit', async function (e) {
    e.preventDefault();
  
    const userType = document.querySelector('input[name="userType"]:checked').value;
    const idOrUsername = document.getElementById('idOrUsername').value;
    const password = document.getElementById('password').value;
  
    const endpoint = userType === 'employee' ? '/api/auth/login/employee' : '/api/auth/login/admin';
  
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userType === 'employee'
          ? { employee_id: idOrUsername, password }
          : { username: idOrUsername, password })
      });
  
      const data = await res.json();
  
      if (data.success) {
        localStorage.setItem('userId', idOrUsername);
        localStorage.setItem('role', userType);
  
        if (userType === 'employee') {
          window.location.href = 'dashboard_employee.html';  // ✅ correct filename
        } else {
          window.location.href = 'dashboard_admin.html';     // ✅ correct filename
        }
      } else {
        alert(data.message || 'Login failed');
      }
  
    } catch (error) {
      console.error('Login error:', error);
      alert('Server error. Please try again later.');
    }
  });
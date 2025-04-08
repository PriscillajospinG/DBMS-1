const empId = localStorage.getItem('userId');

async function loadDashboard() {
  const res = await fetch(`/api/employee/dashboard/${empId}`);
  const data = await res.json();

  if (data.success) {
    document.getElementById('profile').innerHTML = `
      <h3>${data.employee.employee_name}</h3>
      <p>Department: ${data.employee.department}</p>
      <p>Position: ${data.employee.position}</p>
    `;

    document.getElementById('salary').innerHTML = `
      <h4>Salary: ₹${data.salary.total_salary}</h4>
    `;

    document.getElementById('attendance').innerHTML = `
      <h4>Attendance: ${data.attendance.length} days</h4>
    `;
  } else {
    alert('Error fetching dashboard');
  }
}

function logout() {
  localStorage.clear();
  window.location.href = 'index.html';
}

loadDashboard();
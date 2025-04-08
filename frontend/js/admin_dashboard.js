async function getAllEmployees() {
    const res = await fetch('/api/admin/employees');
    const data = await res.json();
  
    const list = document.getElementById('employeeList');
    list.innerHTML = '';
    data.forEach(emp => {
      const li = document.createElement('li');
      li.innerText = `ID: ${emp.employee_id}, Name: ${emp.employee_name}, Dept: ${emp.department}`;
      list.appendChild(li);
    });
  }
  
  document.getElementById('addEmployeeForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const payload = {
      employee_name: document.getElementById('employee_name').value,
      department: document.getElementById('department').value,
      position: document.getElementById('position').value,
      hire_date: document.getElementById('hire_date').value,
      base_salary: document.getElementById('base_salary').value,
      password: document.getElementById('password').value,
    };
  
    const res = await fetch('/api/admin/employees', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  
    const data = await res.json();
    alert(data.message || 'Added!');
    getAllEmployees();
  });
  
  async function deleteEmployee() {
    const id = document.getElementById('deleteId').value;
    const res = await fetch(`/api/admin/employees/${id}`, { method: 'DELETE' });
    const data = await res.json();
    alert(data.message || 'Deleted!');
    getAllEmployees();
  }
  
  async function markAttendance() {
    const empId = document.getElementById('attEmpId').value;
    const status = document.getElementById('attStatus').value;
  
    const res = await fetch(`/api/admin/attendance/${empId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
  
    const data = await res.json();
    alert(data.message || 'Attendance marked!');
  }
  
  function logout() {
    localStorage.clear();
    window.location.href = 'index.html';
  }
  
  // Initial load
  getAllEmployees();
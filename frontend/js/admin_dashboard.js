function getAllEmployees() {
  fetch('/api/employees')
    .then(res => res.json())
    .then(data => {
      const list = document.getElementById('employeeList');
      list.innerHTML = '';
      data.employees.forEach(emp => {
        const li = document.createElement('li');
        li.innerText = `ID: ${emp.employee_id}, Name: ${emp.employee_name}, Dept: ${emp.department}`;
        list.appendChild(li);
      });
    })
    .catch(err => {
      console.error('Error fetching employees:', err);
      alert('Error loading employees. Try again later.');
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

  async function updateEmployee() {
  const employee_id = document.getElementById('updateId').value;
  const employee_name = document.getElementById('updateName').value;
  const department = document.getElementById('updateDept').value;
  const position = document.getElementById('updatePos').value;
  const hire_date = document.getElementById('updateDate').value;
  const base_salary = document.getElementById('updateSalary').value;
  const password = document.getElementById('updatePwd').value;

  if (!employee_id) {
    alert("Please enter the Employee ID.");
    return;
  }

  try {
    const response = await fetch(`/api/employees/${employee_id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        employee_name,
        department,
        position,
        hire_date,
        base_salary,
        password
      })
    });

    const result = await response.json();

    if (result.success) {
      alert("✅ Employee updated successfully!");
      getAllEmployees(); // refresh list
    } else {
      alert("❌ Update failed: " + result.message);
    }
  } catch (error) {
    console.error("Update error:", error);
    alert("Server error while updating employee.");
  }
}
  // Initial load
  getAllEmployees();
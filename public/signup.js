document.getElementById('signup-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('signup-username').value;
    const password = document.getElementById('signup-password').value;
    const role = document.getElementById('signup-role').value;
  
    const response = await fetch('http://localhost:8001/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, role })
    });
  
    const data = await response.json();
    if (data.message) {
      document.getElementById('signup-alert').innerText = data.message;
    } else {
      window.location.href = 'login.html';
    }
  });
  
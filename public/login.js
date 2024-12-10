document.getElementById("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const username = document.getElementById("login-username").value;
  const password = document.getElementById("login-password").value;

  const response = await fetch("http://localhost:8001/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  const data = await response.json();
  if (data.token) {
    localStorage.setItem("authToken", data.token);

    if (data.user.role === "user") {
      window.location.href = "dashboard.html";
    } else {
      window.location.href = "admin-dashboard.html";
    }
  } else {
    document.getElementById("login-alert").innerText =
      "Login failed: " + (data.message || "Invalid credentials");
  }
});

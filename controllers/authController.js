// src/controllers/authController.js//business layer
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const userService = require("../services/userService");
const SECRET_KEY = "your-secret-key"; // Use environment variables in production

// Sign Up route
async function signUp(req, res) {
  const { username, password, role } = req.body;

  if (!username || !password || !role) {
    return res
      .status(400)
      .json({ error: "Username, password, and role are required" });
  }

  try {
    const user = await userService.signUp(username, password, role);
    res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Log In route
async function login(req, res) {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required" });
  }

  try {
    const user = await userService.login(username, password);
    if (user) {
      const token = jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, {
        expiresIn: "1h",
      });
      res.status(200).json({
        message: "Login successful",
        token: token,
        user: {
          username: user.username,
          role: user.role,
        },
      });
    } else {
      res.status(401).json({ error: "Invalid username or password" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = { signUp, login };

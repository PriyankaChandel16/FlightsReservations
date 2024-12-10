// src/services/userService.js
const bcrypt = require('bcrypt');
const db = require('../db/db');

// Sign up a new user
async function signUp(username, password, role) {
  const hashedPassword = await bcrypt.hash(password, 10);
  return new Promise((resolve, reject) => {
    const query = `INSERT INTO users (username, password, role) VALUES (?, ?, ?)`;
    db.run(query, [username, hashedPassword, role], function (err) {
      if (err) return reject(err);
      resolve({ id: this.lastID, username, role });
    });
  });
}

// Log in an existing user
async function login(username, password) {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM users WHERE username = ?`;
    db.get(query, [username], async (err, user) => {
      if (err) return reject(err);
      if (!user) return resolve(null); // User not found

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (isPasswordValid) {
        resolve(user);
      } else {
        resolve(null); // Invalid password
      }
    });
  });
}

module.exports = { signUp, login };

// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

// Middleware to protect routes requiring authentication
function authenticateToken(req, res, next) {
  const token = req.header('Authorization') && req.header('Authorization').split(' ')[1]; // Bearer <token>
  
  console.log("token", token)
  if (!token) {
    return res.status(403).json({ message: 'Access Denied: No token provided' });
  }

  jwt.verify(token, 'your-secret-key', (err, user) => {
    console.log(err)
    if (err) {
      return res.status(403).json({ message: 'Access Denied: Invalid token' });
    }

    console.log("user", user)
    
    req.user = user;  // Attach user info to request object
    next();
  });
}

module.exports = authenticateToken;

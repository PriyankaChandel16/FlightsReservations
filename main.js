// src/main.js
// src/main.js// src/main.js//Presentation layer
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const port = 8001;

// Controllers and Middleware
const authController = require("./controllers/authController");
const flightController = require("./controllers/flightController");
const bookingController = require("./controllers/bookingController");
// const paymentController = require("./controllers/paymentController");
const authenticateToken = require("./middleware/authMiddleware");

app.use(express.json());
app.use(bodyParser.json());
app.use(cors());

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// Serve HTML pages
app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "public", "login.html"))
);
app.get("/signup", (req, res) =>
  res.sendFile(path.join(__dirname, "public", "signup.html"))
);
app.get("/dashboard", (req, res) =>
  res.sendFile(path.join(__dirname, "public", "dashboard.html"))
);

// API routes
app.post("/auth/signup", authController.signUp);
app.post("/auth/login", authController.login);
app.get("/flights", flightController.getAllFlights);

// admin
app.post("/flights", authenticateToken, flightController.addFlight);
// app.get("/flights/search", authenticateToken, flightController.searchFlights);
//app.put("/flights", authenticateToken, flightController.updateFlight);
 //app.delete("/flights", authenticateToken, flightController.deleteFlight);
// app.get("/flights", authenticateToken, flightController.getAllFlight);

// app.get("/bookings", authenticateToken, bookingController.getAllBookings);

// user
app.post("/bookings", authenticateToken, bookingController.createBooking);
app.get("/bookings", authenticateToken, bookingController.getBookings);
// app.post("/payments", authenticateToken, paymentController.createPayment);
// app.get("/bookings/my", authenticateToken, bookingController.myBookings);
//app.delete("/bookings", authenticateToken, bookingController.deleteBookings);
// In main.js or your routes file

// Route to delete a flight
app.delete('/flights/:id', flightController.deleteFlight); // Ensure this is pointing to the correct controller function


app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
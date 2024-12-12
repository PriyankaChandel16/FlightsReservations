// src/controllers/bookingController.js
const jwt = require("jsonwebtoken");
const SECRET_KEY = "your-secret-key";

const bookingService = require('../services/bookingService');

// Route to fetch all bookings
async function getBookings(req, res) {
  try {
    const bookings = await bookingService.getBookings();
    res.status(200).json({ bookings });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Route to create a new booking
async function createBooking(req, res) {
  const { flight_id } = req.body;
  const { id } = req.user; // Assuming the user is authenticated and their ID is available in req.user

  // Check if all required fields are provided
  if (!flight_id) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Unauthorized: Token missing" });
  }

  try {
    // Decode the token to get user details
    const decoded = jwt.verify(token, SECRET_KEY);

    const id = decoded.id;

    // Create booking via booking service
    const booking = await bookingService.createBooking(
      flight_id,
      id
    );
    res.status(201).json({ message: 'Booking successful', booking });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = { getBookings, createBooking };

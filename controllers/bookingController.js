
// src/controllers/bookingController.js

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
  const { flight_id, seat_count } = req.body;
  const {id} = req.user

  if (!flight_id || !id || !seat_count) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  

  try {
    const booking = await bookingService.createBooking(flight_id, id, seat_count);
    res.status(201).json({ message: 'Booking successful', booking });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = { getBookings, createBooking };

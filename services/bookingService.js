// src/services/bookingService.js//Data Access layer
const db = require('../db/db');

// Fetch all bookings
async function getBookings() {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM bookings`;
    db.all(query, (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
}

// Create a new booking
async function createBooking(flight_id, user_id, seat_count) {
  return new Promise((resolve, reject) => {
    const query = `INSERT INTO bookings (flight_id, user_id, seat_count) 
                   VALUES (?, ?, ?)`;
    db.run(query, [flight_id, user_id, seat_count], function(err) {
      if (err) return reject(err);
      resolve({ id: this.lastID, flight_id, user_id, seat_count });
    });
  });
}

module.exports = { getBookings, createBooking };

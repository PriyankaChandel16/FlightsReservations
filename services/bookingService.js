// src/services/bookingService.js//Data Access layer
const db = require('../db/db');

// Fetch all bookings
async function getBookings() {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT bookings.*, users.username AS user_name
      FROM bookings 
      JOIN users ON bookings.user_id = users.id
    `;
    db.all(query, (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
}

// Create a new booking
async function createBooking(
  flightId,
  userId
) {
  return new Promise((resolve, reject) => {
  const query = `INSERT INTO bookings (flight_id,user_id,seat_count,booking_status) 
                   VALUES (?, ?, ?, ?)`;
                   
                   db.run(
                    query,
                    [flightId, userId, null,'confirmed'],
                    function (err) {
                      if (err) return reject(err);
                      resolve({
                        id: this.lastID,
                      });
                    }
                  );
                });
              }

module.exports = { getBookings, createBooking };
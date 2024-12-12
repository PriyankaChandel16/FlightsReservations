// src/services/flightService.js
const db = require("../db/db");

// Fetch all available flights
async function getAllFlights() {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM flights`;
    db.all(query, (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
}

// Fetch all available flights
async function searchFlights(origin, destination) {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM flights WHERE `;
    db.all(query, (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
}

// Add a new flight
async function addFlight(
  origin,
  destination,
  departure_date,
  arrival_date,
  price
) {
  return new Promise((resolve, reject) => {
    const query = `INSERT INTO flights (origin, destination, departure_date, arrival_date, price) 
                   VALUES (?, ?, ?, ?, ?)`;
    db.run(
      query,
      [origin, destination, departure_date, arrival_date, price],
      function (err) {
        if (err) return reject(err);
        resolve({
          id: this.lastID,
          origin,
          destination,
          departure_date,
          arrival_date,
          price,
        });
      }
    );
  });
}

// Fetch a specific flight by ID
async function getFlightById(id) {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM flights WHERE id = ?`;
    db.get(query, [id], (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
}
//// Delete a flight by ID
async function deleteFlightById(id) {
  return new Promise((resolve, reject) => {
    const query = `DELETE FROM flights WHERE id = ?`;
    db.run(query, [id], function (err) {
      if (err) return reject(err);
      if (this.changes === 0) {
        return reject(new Error("Flight not found"));
      }
      resolve({ message: "Flight deleted successfully", id });
    });
  });
}

module.exports = { getAllFlights, addFlight, getFlightById, searchFlights, deleteFlightById };




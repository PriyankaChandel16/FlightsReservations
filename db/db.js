// db/db.js
const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./flightBookings.db", (err) => {
  if (err) {
    console.error("Error connecting to database:", err.message);
  } else {
    console.log("Connected to SQLite database.");
  }
});

// Create Users, Flights, Bookings, and Payments tables
const createTables = () => {
  // Users table (Admin and Regular users)
  const userTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('user', 'admin')) -- Ensures only 'user' or 'admin' role
    )
  `;

  // Flights table (Flight data)
  const flightTableQuery = `
    CREATE TABLE IF NOT EXISTS flights (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      origin TEXT NOT NULL,
      destination TEXT NOT NULL,
      departure_date TEXT NOT NULL,
      arrival_date TEXT NOT NULL,
      price REAL NOT NULL
    )
  `;

  // Bookings table (User bookings)
  const bookingTableQuery = `
    CREATE TABLE IF NOT EXISTS bookings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      flight_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      seat_count INTEGER NOT NULL,
      booking_status TEXT NOT NULL CHECK(booking_status IN ('pending', 'confirmed', 'cancelled')),
      FOREIGN KEY (flight_id) REFERENCES flights (id),
      FOREIGN KEY (user_id) REFERENCES users (id)
    )
  `;

  // Payments table (Transaction records for bookings)
  const paymentTableQuery = `
    CREATE TABLE IF NOT EXISTS payments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      booking_id INTEGER NOT NULL,
      amount REAL NOT NULL,
      payment_method TEXT NOT NULL CHECK(payment_method IN ('credit_card', 'debit_card', 'paypal')),
      payment_date TEXT NOT NULL,
      payment_status TEXT NOT NULL CHECK(payment_status IN ('successful', 'failed', 'pending')),
      FOREIGN KEY (booking_id) REFERENCES bookings (id)
    )
  `;

  // Run the queries to create tables
  db.run(userTableQuery);
  db.run(flightTableQuery);
  db.run(bookingTableQuery);
  db.run(paymentTableQuery);
};

createTables();

module.exports = db;

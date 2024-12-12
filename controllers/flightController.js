// src/controllers/flightController.js
const flightService = require("../services/flightService");
const jwt = require("jsonwebtoken");
const SECRET_KEY = "your-secret-key";

// Route to fetch all available flights
async function getAllFlights(req, res) {
  try {
    const flights = await flightService.getAllFlights();
    res.status(200).json({ flights });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Route to fetch all available flights
async function searchFlights(req, res) {
  try {
    const { origin, destination } = req.query;
    const flights = await flightService.searchFlights(origin, destination);
    res.status(200).json({ flights });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Route to add a new flight
async function addFlight(req, res) {
  const { origin, destination, departure_date, arrival_date, price } = req.body;

  if (!origin || !destination || !departure_date || !arrival_date || !price) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const flight = await flightService.addFlight(
      origin,
      destination,
      departure_date,
      arrival_date,
      price
    );
    res.status(201).json({ message: "Flight added successfully", flight });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Route to fetch flight details by ID
async function getFlightById(req, res) {
  const { id } = req.params;

  try {
    const flight = await flightService.getFlightById(id);
    if (!flight) {
      return res.status(404).json({ message: "Flight not found" });
    }
    res.status(200).json({ flight });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
//// Delete a flight
async function deleteFlight(req, res) {
  const { id } = req.params;  // Get flight ID from route params

  // Extract token from headers
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Unauthorized: Token missing" });
  }

  try {
    // Decode the token to get user details
    const decoded = jwt.verify(token, SECRET_KEY);

    // Check if the user role is admin
    if (decoded.role !== "admin") {
      return res.status(403).json({ error: "Unauthorized: Only admins can delete flights" });
    }

    // Call flight service to delete the flight
    const result = await flightService.deleteFlightById(id);
    if (!result) {
      return res.status(404).json({ error: 'Flight not found' });
    }

    res.status(200).json({ message: 'Flight deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

  
module.exports = { getAllFlights, addFlight, getFlightById, searchFlights, deleteFlight };

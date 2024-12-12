// Mapping for flight ID to airline names based on origin
const airlineMapping = {
  "USA": "Emirates",
  "UK": "British Airways",
  "India": "Indigo",
};

// Logout function
function logout() {
  localStorage.removeItem("authToken");
  window.location.href = "login.html"; // Redirect to login page
}

window.onload = function() {
  getFlights();
// getBookings(); // Fetch bookings on page load
}

// Function to get all bookings and display them
async function getBookings() {
  try {
    const response = await fetch("http://localhost:8001/bookings", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    });

    const data = await response.json();
    const bookingsList = document.getElementById("bookings-list");

    if (response.ok) {
      data.bookings.forEach((booking) => {
        const listItem = document.createElement("li");
        listItem.innerHTML = `
          <strong>User:</strong> ${booking.user_name} <br>
          <strong>Flight:</strong> ${booking.origin} to ${booking.destination} <br>
          <strong>Departure Date:</strong> ${booking.departure_date} <br>
          <strong>Arrival Date:</strong> ${booking.arrival_date} <br>
          <strong>Price:</strong> $${booking.price} <br>
        `;
        bookingsList.appendChild(listItem);
      });
    } else {
      alert(`Error fetching bookings: ${data.error || "Unknown error"}`);
    }
  } catch (error) {
    console.error("Error making the request:", error);
    alert("An error occurred while fetching the bookings. Please try again later.");
  }
}


// Function to create a flight and display a confirmation message
document.getElementById("create-flight").addEventListener("click", async () => {
  let countryFrom = document.getElementById("country-from").value;
  let countryTo = document.getElementById("country-to").value;
  let departureDate = document.getElementById("departure-date").value;
  let arrivalDate = document.getElementById("arrival-date").value;
  let price = document.getElementById("price").value;

  // Validate input
  if (!countryFrom || !countryTo || !departureDate || !arrivalDate || !price) {
    alert("Please fill all required fields!");
    return;
  }

  try {
    const response = await fetch("http://localhost:8001/flights", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },

      body: JSON.stringify({
        origin: countryFrom,
        destination: countryTo,
        arrival_date: arrivalDate,
        departure_date: departureDate,
        price,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      alert("Flight created successfully!");
      addFlightToAvailableList(data);
    } else {
      alert(`Error creating flight: ${data.error || "Unknown error"}`);
    }
  } catch (error) {
    console.error("Error making the request:", error);
    alert("An error occurred while creating the flight. Please try again later.");
  }
});

// Function to dynamically add flight to the list of available flights
function addFlightToAvailableList(data) {
  const flight = data.flight;
  const flightsList = document.getElementById("flights-list");

  // Get the airline name based on the origin
  const airlineName = airlineMapping[flight.origin] || "Unknown Airline";

  const listItem = document.createElement("li");
  listItem.classList.add("flight-item");
  listItem.id = flight.id; // Assign the flight ID to the list item for easy reference

  // Add flight details to the list item
  listItem.innerHTML = `
    <strong>Airline:</strong> ${airlineName} <br>
    <strong>From:</strong> ${flight.origin} <br>
    <strong>To:</strong> ${flight.destination} <br>
    <strong>Departure Date:</strong> ${flight.departure_date} <br>
    <strong>Arrival Date:</strong> ${flight.arrival_date} <br>
    <strong>Price:</strong> $${flight.price} <br>
    <button class="delete-btn" onclick="deleteFlight('${flight.id}')">Delete</button>
  `;

  flightsList.appendChild(listItem);
}

// Function to delete a flight from the server and UI
async function deleteFlight(flightId) {
  try {
    const response = await fetch(`http://localhost:8001/flights/${flightId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    });

    const data = await response.json();

    if (response.ok) {
      alert("Flight deleted successfully!");
      getFlights()
    } else {
      alert(`Error deleting flight: ${data.error || "Unknown error"}`);
    }
  } catch (error) {
    console.error("Error making the request:", error);
    alert("An error occurred while deleting the flight. Please try again later.");
  }
}

// Function to get all flights when the page loads
async function getFlights() {
  try {
    const response = await fetch("http://localhost:8001/flights", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    });

    const data = await response.json();
    const flightsList = document.getElementById("flights-list");

    if (response.ok) {
      data.flights.forEach((flight) => {                

        // Get the airline name based on the origin
        const airlineName = airlineMapping[flight.origin] || "Unknown Airline";

        const listItem = document.createElement("li");
        listItem.classList.add("flight-item");
        listItem.id = flight.id; // Assign the flight ID to the list item for easy reference

        // Add flight details to the list item
        listItem.innerHTML = `
          <strong>Airline:</strong> ${airlineName} <br>
          <strong>From:</strong> ${flight.origin} <br>
          <strong>To:</strong> ${flight.destination} <br>
          <strong>Departure Date:</strong> ${flight.departure_date} <br>
          <strong>Arrival Date:</strong> ${flight.arrival_date} <br>
          <strong>Price:</strong> $${flight.price} <br>
          <button class="delete-btn" onclick="deleteFlight('${flight.id}')">Delete</button>
        `;

        flightsList.appendChild(listItem);  
      });
    } else {
      alert(`Error fetching flights: ${data.error || "Unknown error"}`);
    }
  } catch (error) {
    console.error("Error making the request:", error);
    alert("An error occurred while fetching the flights. Please try again later.");
  }
}

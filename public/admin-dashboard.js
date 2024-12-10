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

    // Handle the flight creation success
    if (response.ok) {
      // Show success message
      alert("Flight created successfully!");

      // Add the newly created flight to the available flights list
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
function addFlightToAvailableList(flight) {
  const flightsList = document.getElementById("flights-list");

  // Get the airline name based on the origin (you can modify this logic)
  const airlineName = airlineMapping[flight.origin] || "Unknown Airline";

  const listItem = document.createElement("li");
  listItem.classList.add("flight-item");

  // Add flight details to the list item
  listItem.innerHTML = `
    <strong>Airline:</strong> ${airlineName} <br>
    <strong>From:</strong> ${flight.origin} <br>
    <strong>To:</strong> ${flight.destination} <br>
    <strong>Departure Date:</strong> ${flight.departure_date} <br>
    <strong>Arrival Date:</strong> ${flight.arrival_date} <br>
    <strong>Price:</strong> $${flight.price} <br>
  `;

  // Append the new flight to the list of flights
  flightsList.appendChild(listItem);
}

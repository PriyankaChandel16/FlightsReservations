let bookings = [];
let selectedFlight = null; // Store the selected flight for booking
const airlineMapping = {
  "USA": "Emirates",
  "UK": "British Airways",
  "India": "Indigo",
};

let flights = [];

window.onload = function () {
  getFlights();  
};

// Function to fetch flights dynamically from the backend
async function getFlights() {
  try {
    const response = await fetch("http://localhost:8001/flights", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    flights = data;
    const flightsList = document.getElementById("flights-list");
    flightsList.innerHTML = ""; // Clear existing flights

    if (response.ok && data.flights.length > 0) {
      data.flights.forEach((flight) => {
        const listItem = document.createElement("li");
        listItem.innerHTML = `
          ${airlineMapping[flight.origin] || "Unknown Airline"} - ${flight.origin} to ${flight.destination} on ${flight.departure_date} 
          - $${flight.price}
          <button class="action-btns" onclick="selectFlight(${flight.id})">Select</button>
        `;
        flightsList.appendChild(listItem);
      });
      fetchBookings();
    } else {
      flightsList.innerHTML = "<li>No flights available at the moment.</li>";
    }
  } catch (error) {
    console.error("Error fetching flights:", error);
    alert("An error occurred while fetching the flights. Please try again later.");
  }
}

// Function to search flights based on user input
document.getElementById("search-flights").addEventListener("click", () => {
  const countryFrom = document.getElementById("country-from").value;
  const countryTo = document.getElementById("country-to").value;
  const travelDate = document.getElementById("travel-date").value;

  if (!countryFrom || !countryTo || !travelDate) {
    alert("Please fill all required fields!");
    return;
  }

  // Filter flights (assuming a backend filter API for production)
  const filteredFlights = document.querySelectorAll("#flights-list li");
  filteredFlights.forEach((flight) => {
    const flightText = flight.textContent.toLowerCase();
    if (
      flightText.includes(countryFrom.toLowerCase()) &&
      flightText.includes(countryTo.toLowerCase()) &&
      flightText.includes(travelDate)
    ) {
      flight.style.display = "list-item";
    } else {
      flight.style.display = "none";
    }
  });
});

// Function to select a flight for booking
function selectFlight(flightId) {
  // Fetch flight details from the backend (optional for production)
  const flightsList = document.querySelectorAll("#flights-list li");
  const flightElement = Array.from(flightsList).find((item) =>
    item.innerHTML.includes(`onclick="selectFlight(${flightId})"`)
  );

  if (!flightElement) {
    alert("Flight not found!");
    return;
  }

  let flight = flights.flights.find((i)=> {
    return i.id == flightId
  });
  // Extract flight details (for simplicity, parsing from the DOM)
  selectedFlight = {
    flight_id: flight.id,
    airline: airlineMapping[flight.origin] || "Unknown Airline",
    origin: flight.origin,
    destination: flight.destination,
    departure_date: flight.departure_date,
    arrival_date: flight.arrival_date, // Ensure this property exists in your flight data
    price: flight.price,
  };

  document.getElementById("flight-details").innerHTML = `
    ${selectedFlight.airline} - ${selectedFlight.origin} to ${selectedFlight.destination} on ${selectedFlight.departure_date}
  `;
  document.getElementById("selected-flight").style.display = "block";
  document.getElementById("pay-now-btn").style.display = "block";
  document.getElementById("payment-section").style.display = "none";
}

document.getElementById("pay-now-btn").addEventListener("click", async () => {
  document.getElementById("payment-section").style.display = "block";
});

// Handle payment form submission
document.getElementById("payment-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const cardNumber = document.getElementById("card-number").value;
  const expiryMonth = document.getElementById("expiry-month").value;
  const expiryYear = document.getElementById("expiry-year").value;
  const cvv = document.getElementById("cvv").value;
  const errorMessage = document.getElementById("payment-error");

  // Validate inputs
  if (cardNumber.length !== 16) {
    errorMessage.textContent = "Card number must be 16 digits!";
    errorMessage.style.display = "block";
    return;
  }
  if (cvv.length !== 3) {
    errorMessage.textContent = "CVV must be 3 digits!";
    errorMessage.style.display = "block";
    return;
  }
  if (!expiryMonth || !expiryYear) {
    errorMessage.textContent = "Please select a valid expiry date!";
    errorMessage.style.display = "block";
    return;
  }

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();

  if (parseInt(expiryYear) < currentYear || (parseInt(expiryYear) === currentYear && parseInt(expiryMonth) < currentMonth)) {
    errorMessage.textContent = "Expiry date must not be in the past!";
    errorMessage.style.display = "block";
    return;
  }

  errorMessage.style.display = "none";

  // Create booking on the server
  if (selectedFlight) {
    try {
      const response = await fetch("http://localhost:8001/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("authToken")}` // Assuming you store the token in localStorage
        },
        body: JSON.stringify({flight_id: selectedFlight.flight_id}),
      });

      if (response.ok) {
        alert("Payment successful! Your flight is confirmed.");
        fetchBookings(); // Fetch and display bookings after successful payment
        selectedFlight = null; // Reset selection
      } else {
        alert("Failed to create booking. Please try again.");
      }
    } catch (error) {
      console.error("Error creating booking:", error);
      alert("An error occurred while creating the booking. Please try again later.");
    }
  }

  document.getElementById("payment-section").style.display = "none";
  document.getElementById("selected-flight").style.display = "none";
});

// Fetch and display bookings on page load
async function fetchBookings() {
  try {
    const response = await fetch("http://localhost:8001/bookings", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("authToken")}` // Assuming you store the token in localStorage
      },
    });

    if (response.ok) {
      const data = await response.json();
      bookings = data.bookings; // Assuming the response contains an array of bookings
      const bookingList = data.bookings;
      displayBookings(bookingList);
    } else {
      console.error("Failed to fetch bookings.");
    }
  } catch (error) {
    console.error("Error fetching bookings:", error);
  }
}

// Display all bookings
function displayBookings(bookingList) {
  const bookingsList = document.getElementById("bookings-list");
  bookingsList.innerHTML = "";
  bookingList.forEach((booking, index) => {
    let flight = flights.flights.find((i) => {
      return i.id == booking.flight_id
    });
    if(flight){
      const listItem = document.createElement("li");
    listItem.innerHTML = `
      Booking ID: ${booking.id} - ${airlineMapping[flight.origin] || "Unknown Airline"} - ${flight.origin} to ${flight.destination} on ${flight.departure_date}
      <div class="action-btns">
        <button onclick="modifyBooking(${index})">Modify</button>
        <button onclick="deleteBooking(${index})">Delete</button>
      </div>
    `;
    bookingsList.appendChild(listItem); 
    }
  });
}

// Modify a booking
function modifyBooking(index) {
  const newDate = prompt("Enter the new travel date (yyyy-mm-dd):", bookings[index].departure_date);
  if (newDate) {
    bookings[index].departure_date = newDate;
    displayBookings();
    alert("Booking modified successfully!");
  }
}

// Delete a booking
function deleteBooking(index) {
  bookings.splice(index, 1);
  displayBookings();
  alert("Booking deleted successfully!");
}

// Logout function
function logout() {
  window.location.href = "login.html"; // Redirect to login page
}

// Toggle return date visibility based on trip type
document.getElementById("trip-type").addEventListener("change", (e) => {
  if (e.target.value === "round-trip") {
    document.getElementById("return-date-div").style.display = "block";
  } else {
    document.getElementById("return-date-div").style.display = "none";
  }
});

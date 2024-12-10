let bookings = [];
let modifyingIndex = -1; // Track the booking being modified
let selectedFlight = null; // Selected flight for booking

// Function to simulate searching for flights
document.getElementById('search-flights').addEventListener('click', () => {
  let countryFrom = document.getElementById('country-from').value;
  let countryTo = document.getElementById('country-to').value;
  let travelDate = document.getElementById('travel-date').value;
  let tripType = document.getElementById('trip-type').value;
  let returnDate = document.getElementById('return-date').value;

  // Validate input
  if (!countryFrom || !countryTo || !travelDate || !tripType) {
    alert('Please fill all required fields!');
    return;
  }

  // Simulate available flights with airline names
  const flights = [
    { id: 1, from: countryFrom, to: countryTo, date: travelDate, price: 500, airline: 'Emirates' },
    { id: 2, from: countryFrom, to: countryTo, date: travelDate, price: 600, airline: 'Indigo' },
    { id: 3, from: countryFrom, to: countryTo, date: travelDate, price: 700, airline: 'Vistara' },
  ];

  // Display the flights
  let flightsList = document.getElementById('flights-list');
  flightsList.innerHTML = '';
  flights.forEach(flight => {
    let li = document.createElement('li');
    li.innerHTML = `${flight.airline} - ${flight.from} to ${flight.to} on ${flight.date} - $${flight.price}
    <button class="action-btns" onclick="selectFlight(${flight.id})">Select</button>`;
    flightsList.appendChild(li);
  });
});

// Function to select a flight for booking
function selectFlight(flightId) {
  // Get the flight from the available flights
  const flight = [
    { id: 1, from: 'USA', to: 'UK', date: '2024-12-15', price: 500, airline: 'Emirates' },
    { id: 2, from: 'USA', to: 'UK', date: '2024-12-20', price: 600, airline: 'Indigo' },
    { id: 3, from: 'USA', to: 'UK', date: '2024-12-25', price: 700, airline: 'Vistara' },
  ].find(f => f.id === flightId);

  if (!flight) {
    alert('Flight not found!');
    return;
  }

  selectedFlight = flight; // Set the selected flight

  // Display the selected flight details
  document.getElementById('flight-details').innerHTML = `${flight.airline} - ${flight.from} to ${flight.to} on ${flight.date}`;
  document.getElementById('selected-flight').style.display = 'block';
  document.getElementById('pay-now-btn').style.display = 'block';
  document.getElementById('payment-section').style.display = 'none'; // Hide payment section initially
}

// Handle the "Proceed to Payment" button click
document.getElementById('pay-now-btn').addEventListener('click', function() {
  // Show the payment form once "Proceed to Payment" is clicked
  document.getElementById('payment-section').style.display = 'block';
});

// Function to handle payment
document.getElementById('payment-form').addEventListener('submit', function(e) {
  e.preventDefault();

  let cardNumber = document.getElementById('card-number').value;
  let expiryMonth = document.getElementById('expiry-month').value;
  let expiryYear = document.getElementById('expiry-year').value;
  let cvv = document.getElementById('cvv').value;
  let errorMessage = document.getElementById('payment-error');

  // Validate card number (must be 16 digits)
  if (cardNumber.length !== 16) {
    errorMessage.textContent = 'Card number must be 16 digits!';
    errorMessage.style.display = 'block';
    return;
  }

  // Validate CVV (must be 3 digits)
  if (cvv.length !== 3) {
    errorMessage.textContent = 'CVV must be 3 digits!';
    errorMessage.style.display = 'block';
    return;
  }

  // Validate expiry date
  if (!expiryMonth || !expiryYear) {
    errorMessage.textContent = 'Please select a valid expiry date!';
    errorMessage.style.display = 'block';
    return;
  }

  // Get the current date
  let currentDate = new Date();
  let currentMonth = currentDate.getMonth() + 1;  // Months are 0-indexed in JS
  let currentYear = currentDate.getFullYear();

  // Check if the expiry date is in the future
  if (parseInt(expiryYear) < currentYear || (parseInt(expiryYear) === currentYear && parseInt(expiryMonth) < currentMonth)) {
    errorMessage.textContent = 'Expiry date must not be in the past!';
    errorMessage.style.display = 'block';
    return;
  }

  // If validation passes, process payment
  errorMessage.style.display = 'none';
  alert('Payment successful! Your flight is confirmed.');

  // Add the selected flight to bookings
  if (selectedFlight) {
    bookings.push(selectedFlight);
  }

  displayBookings();

  // Hide payment section and show booking confirmation
  document.getElementById('payment-section').style.display = 'none';
  document.getElementById('selected-flight').style.display = 'none';
});

// Display bookings
function displayBookings() {
  let bookingsList = document.getElementById('bookings-list');
  bookingsList.innerHTML = '';
  bookings.forEach((booking, index) => {
    let li = document.createElement('li');
    li.innerHTML = `Booking ID: ${index + 1} - ${booking.airline} - ${booking.from} to ${booking.to} on ${booking.date}
    <div class="action-btns">
      <button class="modify-btn" onclick="modifyBooking(${index})">Modify</button>
      <button class="delete-btn" onclick="deleteBooking(${index})">Delete</button>
    </div>`;
    bookingsList.appendChild(li);
  });
}

// Modify booking (change the travel date)
function modifyBooking(index) {
  let booking = bookings[index];
  let newDate = prompt("Enter the new travel date (yyyy-mm-dd):", booking.date);
  
  if (newDate) {
    bookings[index].date = newDate;
    displayBookings();
    alert(`Booking modified successfully! New travel date: ${newDate}`);
  } else {
    alert('No changes made.');
  }
}

// Delete booking
function deleteBooking(index) {
  bookings.splice(index, 1);
  displayBookings();
  alert('Booking deleted successfully!');
}

// Logout function
function logout() {
  window.location.href = 'login.html'; // Redirect to login page
}

// Toggle return date visibility based on trip type
document.getElementById('trip-type').addEventListener('change', (e) => {
  if (e.target.value === 'round-trip') {
    document.getElementById('return-date-div').style.display = 'block';
  } else {
    document.getElementById('return-date-div').style.display = 'none';
  }
});

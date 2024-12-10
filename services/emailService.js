// src/services/emailService.js
const nodemailer = require('nodemailer');

// Create a transport instance for sending emails
const transporter = nodemailer.createTransport({
  service: 'gmail', // You can use other email services like Yahoo, Outlook, etc.
  auth: {
    user: 'your-email@gmail.com',  // Enter your email
    pass: 'your-email-password'    // Enter your email password or app password
  }
});

// Send booking confirmation email
function sendBookingConfirmation(userEmail, bookingDetails) {
  const mailOptions = {
    from: 'your-email@gmail.com',
    to: userEmail,
    subject: 'Booking Confirmation',
    text: `Hello,

Your booking is confirmed!

Flight Details:
- Flight ID: ${bookingDetails.flight_id}
- Seats Booked: ${bookingDetails.seat_count}

Thank you for booking with us!

Best regards,
Flight Booking Team`
  };

  return transporter.sendMail(mailOptions);
}

module.exports = { sendBookingConfirmation };

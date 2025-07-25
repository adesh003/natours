const express = require('express');
const authController = require('./../controllers/authController');
const bookingController = require('../controllers/bookingController');

const router = express.Router();

// 🔐 Protect all routes after this middleware
router.use(authController.protect);

// 🛒 Checkout session for booking a tour
router.get(
  '/checkout-session/:tourId',
  bookingController.getCheckoutSession
);

// 👮 Restrict below routes to admin or lead-guide only
router.use(authController.restrictTo('admin', 'lead-guide'));

// 📚 CRUD routes for bookings
router
  .route('/')
  .get(bookingController.getAllBookings)
  .post(bookingController.createBooking);

router
  .route('/:id')
  .get(bookingController.getBooking)
  .patch(bookingController.updateBooking)
  .delete(bookingController.deleteBooking);

module.exports = router;

const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getAllBookings,
} = require('../controllers/adminController');
const { protect, authorizeAdmin } = require('../middleware/auth');

router.get('/stats', protect, authorizeAdmin, getDashboardStats);
router.get('/bookings', protect, authorizeAdmin, getAllBookings);

module.exports = router;

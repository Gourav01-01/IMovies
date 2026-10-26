const Booking = require('../models/Booking');
const Show = require('../models/Show');

// @desc    Create a new booking (with double-booking protection & demo payment)
// @route   POST /api/bookings
// @access  Private
exports.createBooking = async (req, res, next) => {
  try {
    const {
      showId,
      seats, // Array of { seatNumber, seatType, price }
      paymentMethod = 'demo_card',
      couponCode = '',
    } = req.body;

    if (!showId || !Array.isArray(seats) || seats.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide showId and at least one seat to book',
      });
    }

    const show = await Show.findById(showId)
      .populate('movie', 'title poster runtime')
      .populate('theatre', 'name location');

    if (!show) {
      return res.status(404).json({
        success: false,
        message: 'Show not found',
      });
    }

    if (show.isCancelled) {
      return res.status(400).json({
        success: false,
        message: 'This show has been cancelled by the cinema administrator',
      });
    }

    // Check if show time has passed
    if (new Date(show.showTime) < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot book tickets for a show that has already started or ended',
      });
    }

    const requestedSeatNumbers = seats.map((s) => s.seatNumber.toUpperCase());

    // SERVER-SIDE DOUBLE-BOOKING PREVENTION
    const alreadyBooked = requestedSeatNumbers.filter((seatNum) =>
      show.bookedSeats.includes(seatNum)
    );

    if (alreadyBooked.length > 0) {
      return res.status(409).json({
        success: false,
        message: `Seats [${alreadyBooked.join(', ')}] were just booked by another guest. Please select different seats.`,
        conflictingSeats: alreadyBooked,
      });
    }

    // Verify seat prices & calculate totals
    let subtotal = 0;
    const validatedSeats = [];

    for (const seatReq of seats) {
      const sNumber = seatReq.seatNumber.toUpperCase();
      const seatInLayout = show.seatLayout.find((s) => s.seatNumber === sNumber);
      const price = seatInLayout ? seatInLayout.price : seatReq.price || 200;
      const seatType = seatInLayout ? seatInLayout.seatType : seatReq.seatType || 'standard';

      subtotal += price;
      validatedSeats.push({
        seatNumber: sNumber,
        seatType,
        price,
      });
    }

    // Convenience fee calculation (e.g., $1.50 or Rs 30 base + Rs 10 per seat)
    const convenienceFee = Math.round(25 + validatedSeats.length * 15);

    // Coupon discount logic
    let discount = 0;
    if (couponCode && couponCode.trim().toUpperCase() === 'IMOVIES50') {
      discount = Math.min(Math.round(subtotal * 0.2), 100); // 20% off up to 100
    } else if (couponCode && couponCode.trim().toUpperCase() === 'WELCOME10') {
      discount = Math.round(subtotal * 0.1); // 10% off
    }

    const totalAmount = Math.max(0, subtotal + convenienceFee - discount);

    // Generate Human-friendly Booking ID e.g. "IMV-837492"
    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    const bookingId = `IMV-${randomSuffix}`;
    const demoTransactionId = `TXN_DEMO_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;

    // Update the show: mark seats as booked and add to bookedSeats
    requestedSeatNumbers.forEach((sNum) => {
      show.bookedSeats.push(sNum);
      const layoutSeat = show.seatLayout.find((s) => s.seatNumber === sNum);
      if (layoutSeat) {
        layoutSeat.status = 'booked';
        layoutSeat.lockedBy = null;
        layoutSeat.lockedUntil = null;
      }
    });

    await show.save();

    // Create Booking Document
    const booking = await Booking.create({
      bookingId,
      user: req.user._id,
      show: show._id,
      movie: show.movie._id,
      theatre: show.theatre._id,
      seats: validatedSeats,
      subtotal,
      convenienceFee,
      discount,
      totalAmount,
      paymentStatus: 'completed',
      paymentMethod,
      paymentId: demoTransactionId,
      bookingStatus: 'confirmed',
      bookingDate: new Date(),
    });

    // Populate booking for instant response
    const populatedBooking = await Booking.findById(booking._id)
      .populate('movie', 'title poster backdrop runtime certificate language')
      .populate('theatre', 'name location')
      .populate('show', 'screenName showTime pricing')
      .populate('user', 'name email phone');

    // Broadcast live update to Socket.IO room if socket instance exists
    const io = req.app.get('io');
    if (io) {
      io.to(`show_${showId}`).emit('seats_updated', {
        showId,
        bookedSeats: show.bookedSeats,
        newlyBooked: requestedSeatNumbers,
      });
    }

    res.status(201).json({
      success: true,
      message: 'Tickets booked successfully!',
      booking: populatedBooking,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get logged in user's bookings (upcoming & past with pagination)
// @route   GET /api/bookings/my
// @access  Private
exports.getMyBookings = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const query = { user: req.user._id };

    if (status && status !== 'All') {
      query.bookingStatus = status.toLowerCase();
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const skip = (pageNum - 1) * limitNum;

    const total = await Booking.countDocuments(query);
    const bookings = await Booking.find(query)
      .populate('movie', 'title poster runtime language certificate')
      .populate('theatre', 'name location')
      .populate('show', 'screenName showTime isCancelled')
      .sort({ bookingDate: -1 })
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      count: bookings.length,
      total,
      totalPages: Math.ceil(total / limitNum) || 1,
      currentPage: pageNum,
      bookings,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single booking by ID
// @route   GET /api/bookings/:id
// @access  Private
exports.getBookingById = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('movie', 'title poster backdrop runtime language certificate genre')
      .populate('theatre', 'name location amenities phone')
      .populate('show', 'screenName showTime pricing isCancelled')
      .populate('user', 'name email phone');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    // Verify ownership or admin
    if (
      booking.user._id.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this booking',
      });
    }

    // Calculate cancellation eligibility: show must be at least 1 hour away
    const showTime = booking.show ? new Date(booking.show.showTime) : null;
    const now = new Date();
    const canCancel =
      booking.bookingStatus === 'confirmed' &&
      showTime &&
      showTime.getTime() - now.getTime() > 60 * 60 * 1000;

    res.status(200).json({
      success: true,
      booking,
      cancellationEligible: Boolean(canCancel),
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Cancel booking (Releases seats back to availability)
// @route   PUT /api/bookings/:id/cancel
// @access  Private
exports.cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('show');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    // Verify ownership or admin
    if (
      booking.user.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this booking',
      });
    }

    if (booking.bookingStatus === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'This booking has already been cancelled',
      });
    }

    const show = await Show.findById(booking.show._id || booking.show);

    if (show) {
      const seatNumbersToRelease = booking.seats.map((s) => s.seatNumber);

      // Remove seats from bookedSeats
      show.bookedSeats = show.bookedSeats.filter(
        (sNum) => !seatNumbersToRelease.includes(sNum)
      );

      // Re-enable availability in seatLayout
      show.seatLayout.forEach((seat) => {
        if (seatNumbersToRelease.includes(seat.seatNumber)) {
          seat.status = 'available';
          seat.lockedBy = null;
          seat.lockedUntil = null;
        }
      });

      await show.save();

      // Emit socket update to notify clients looking at this show
      const io = req.app.get('io');
      if (io) {
        io.to(`show_${show._id}`).emit('seats_updated', {
          showId: show._id,
          bookedSeats: show.bookedSeats,
          releasedSeats: seatNumbersToRelease,
        });
      }
    }

    booking.bookingStatus = 'cancelled';
    booking.paymentStatus = 'refunded';
    booking.cancelledAt = new Date();
    booking.cancellationReason = req.body.reason || 'Cancelled by customer';

    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully. Demo refund initiated.',
      booking,
    });
  } catch (err) {
    next(err);
  }
};

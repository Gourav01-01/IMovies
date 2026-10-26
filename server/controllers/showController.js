const Show = require('../models/Show');
const Movie = require('../models/Movie');
const Theatre = require('../models/Theatre');

// @desc    Get shows with filters
// @route   GET /api/shows
// @access  Public
exports.getShows = async (req, res, next) => {
  try {
    const { movie, theatre, date, city } = req.query;
    const query = { isCancelled: false };

    if (movie) query.movie = movie;
    if (theatre) query.theatre = theatre;

    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      query.showTime = { $gte: startOfDay, $lte: endOfDay };
    } else {
      // By default shows from current time onwards
      query.showTime = { $gte: new Date(Date.now() - 30 * 60 * 1000) };
    }

    let shows = await Show.find(query)
      .populate('movie', 'title poster language runtime rating genre')
      .populate('theatre', 'name location amenities')
      .sort({ showTime: 1 });

    if (city && city !== 'All') {
      shows = shows.filter(
        (s) =>
          s.theatre &&
          s.theatre.location &&
          s.theatre.location.city.toLowerCase() === city.toLowerCase()
      );
    }

    res.status(200).json({
      success: true,
      count: shows.length,
      shows,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single show by ID (including seat layout)
// @route   GET /api/shows/:id
// @access  Public
exports.getShowById = async (req, res, next) => {
  try {
    const show = await Show.findById(req.params.id)
      .populate('movie', 'title poster backdrop runtime rating genre certificate language')
      .populate('theatre', 'name location amenities screens');

    if (!show) {
      return res.status(404).json({
        success: false,
        message: 'Show not found',
      });
    }

    // Clean up expired seat locks if any
    const now = new Date();
    let updated = false;
    show.seatLayout.forEach((seat) => {
      if (seat.status === 'locked' && seat.lockedUntil && seat.lockedUntil < now) {
        seat.status = 'available';
        seat.lockedBy = null;
        seat.lockedUntil = null;
        updated = true;
      }
    });

    if (updated) {
      await show.save();
    }

    res.status(200).json({
      success: true,
      show,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create new show (Admin)
// @route   POST /api/shows
// @access  Private/Admin
exports.createShow = async (req, res, next) => {
  try {
    const { movie, theatre, screenName, showTime, pricing } = req.body;

    if (!movie || !theatre || !screenName || !showTime) {
      return res.status(400).json({
        success: false,
        message: 'Please provide movie, theatre, screenName, and showTime',
      });
    }

    const movieDoc = await Movie.findById(movie);
    if (!movieDoc) {
      return res.status(404).json({ success: false, message: 'Movie not found' });
    }

    const theatreDoc = await Theatre.findById(theatre);
    if (!theatreDoc) {
      return res.status(404).json({ success: false, message: 'Theatre not found' });
    }

    const showPrices = {
      vip: pricing?.vip ? Number(pricing.vip) : 350,
      premium: pricing?.premium ? Number(pricing.premium) : 250,
      standard: pricing?.standard ? Number(pricing.standard) : 180,
    };

    const show = new Show({
      movie,
      theatre,
      screenName,
      showTime: new Date(showTime),
      pricing: showPrices,
      bookedSeats: [],
    });

    // Generate standard seat layout
    show.generateSeatLayout();

    await show.save();

    const populated = await Show.findById(show._id)
      .populate('movie', 'title')
      .populate('theatre', 'name location.city');

    res.status(201).json({
      success: true,
      message: 'Show scheduled successfully',
      show: populated,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update show (Admin)
// @route   PUT /api/shows/:id
// @access  Private/Admin
exports.updateShow = async (req, res, next) => {
  try {
    let show = await Show.findById(req.params.id);

    if (!show) {
      return res.status(404).json({
        success: false,
        message: 'Show not found',
      });
    }

    const { movie, theatre, screenName, showTime, pricing, isCancelled } = req.body;

    if (movie) show.movie = movie;
    if (theatre) show.theatre = theatre;
    if (screenName) show.screenName = screenName;
    if (showTime) show.showTime = new Date(showTime);
    if (isCancelled !== undefined) show.isCancelled = isCancelled;

    if (pricing) {
      if (pricing.vip) show.pricing.vip = Number(pricing.vip);
      if (pricing.premium) show.pricing.premium = Number(pricing.premium);
      if (pricing.standard) show.pricing.standard = Number(pricing.standard);

      // Update seat prices in unbooked seats
      show.seatLayout.forEach((seat) => {
        if (seat.seatType === 'vip') seat.price = show.pricing.vip;
        if (seat.seatType === 'premium') seat.price = show.pricing.premium;
        if (seat.seatType === 'standard') seat.price = show.pricing.standard;
      });
    }

    await show.save();

    res.status(200).json({
      success: true,
      message: 'Show updated successfully',
      show,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete show (Admin)
// @route   DELETE /api/shows/:id
// @access  Private/Admin
exports.deleteShow = async (req, res, next) => {
  try {
    const show = await Show.findById(req.params.id);

    if (!show) {
      return res.status(404).json({
        success: false,
        message: 'Show not found',
      });
    }

    if (show.bookedSeats && show.bookedSeats.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete show with ${show.bookedSeats.length} active bookings. Please cancel the show instead.`,
      });
    }

    await show.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Show deleted successfully',
    });
  } catch (err) {
    next(err);
  }
};

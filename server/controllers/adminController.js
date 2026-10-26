const Booking = require('../models/Booking');
const Movie = require('../models/Movie');
const Theatre = require('../models/Theatre');
const Show = require('../models/Show');
const User = require('../models/User');

// @desc    Get dashboard metrics & analytics
// @route   GET /api/admin/stats
// @access  Private/Admin
exports.getDashboardStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalMovies = await Movie.countDocuments();
    const totalTheatres = await Theatre.countDocuments();
    const totalShows = await Show.countDocuments({ isCancelled: false });
    const totalBookings = await Booking.countDocuments();

    // Aggregations: revenue & confirmed bookings
    const confirmedBookings = await Booking.find({ bookingStatus: 'confirmed' });
    const totalRevenue = confirmedBookings.reduce(
      (sum, b) => sum + (b.totalAmount || 0),
      0
    );

    const totalTicketsSold = confirmedBookings.reduce(
      (sum, b) => sum + (b.seats?.length || 0),
      0
    );

    // Recent 6 bookings
    const recentBookings = await Booking.find()
      .populate('user', 'name email')
      .populate('movie', 'title poster')
      .populate('theatre', 'name location.city')
      .populate('show', 'showTime screenName')
      .sort({ bookingDate: -1 })
      .limit(6);

    // Sales by Movie
    const movieSalesMap = {};
    for (const b of confirmedBookings) {
      const mId = b.movie?.toString();
      if (!mId) continue;
      if (!movieSalesMap[mId]) {
        movieSalesMap[mId] = { tickets: 0, revenue: 0 };
      }
      movieSalesMap[mId].tickets += b.seats?.length || 0;
      movieSalesMap[mId].revenue += b.totalAmount || 0;
    }

    const topMoviesList = [];
    const movies = await Movie.find({ _id: { $in: Object.keys(movieSalesMap) } }).select('title poster rating');
    for (const m of movies) {
      const data = movieSalesMap[m._id.toString()] || { tickets: 0, revenue: 0 };
      topMoviesList.push({
        _id: m._id,
        title: m.title,
        poster: m.poster,
        rating: m.rating,
        tickets: data.tickets,
        revenue: data.revenue,
      });
    }
    topMoviesList.sort((a, b) => b.revenue - a.revenue);

    res.status(200).json({
      success: true,
      stats: {
        totalRevenue,
        totalTicketsSold,
        totalBookings,
        totalUsers,
        totalMovies,
        totalTheatres,
        totalShows,
      },
      recentBookings,
      topMovies: topMoviesList.slice(0, 5),
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all bookings with filters & pagination
// @route   GET /api/admin/bookings
// @access  Private/Admin
exports.getAllBookings = async (req, res, next) => {
  try {
    const { status, search, page = 1, limit = 10 } = req.query;
    const query = {};

    if (status && status !== 'All') {
      query.bookingStatus = status.toLowerCase();
    }

    if (search && search.trim()) {
      query.$or = [
        { bookingId: { $regex: search.trim(), $options: 'i' } },
        { paymentId: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const skip = (pageNum - 1) * limitNum;

    const total = await Booking.countDocuments(query);
    const bookings = await Booking.find(query)
      .populate('user', 'name email phone')
      .populate('movie', 'title poster')
      .populate('theatre', 'name location.city')
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

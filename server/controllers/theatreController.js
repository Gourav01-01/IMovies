const Theatre = require('../models/Theatre');
const Show = require('../models/Show');

// @desc    Get all theatres with optional city filter
// @route   GET /api/theatres
// @access  Public
exports.getTheatres = async (req, res, next) => {
  try {
    const { city, search } = req.query;
    const query = {};

    if (city && city !== 'All') {
      query['location.city'] = new RegExp(`^${city}$`, 'i');
    }

    if (search && search.trim()) {
      query.$or = [
        { name: { $regex: search.trim(), $options: 'i' } },
        { 'location.address': { $regex: search.trim(), $options: 'i' } },
      ];
    }

    const theatres = await Theatre.find(query).sort({ name: 1 });

    res.status(200).json({
      success: true,
      count: theatres.length,
      theatres,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single theatre by ID
// @route   GET /api/theatres/:id
// @access  Public
exports.getTheatreById = async (req, res, next) => {
  try {
    const theatre = await Theatre.findById(req.params.id);

    if (!theatre) {
      return res.status(404).json({
        success: false,
        message: 'Theatre not found',
      });
    }

    // Also get active shows in this theatre
    const shows = await Show.find({
      theatre: theatre._id,
      showTime: { $gte: new Date() },
      isCancelled: false,
    })
      .populate('movie', 'title poster runtime genre rating')
      .sort({ showTime: 1 });

    res.status(200).json({
      success: true,
      theatre,
      shows,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create new theatre (Admin)
// @route   POST /api/theatres
// @access  Private/Admin
exports.createTheatre = async (req, res, next) => {
  try {
    const { name, location, screens, amenities, phone } = req.body;

    if (!name || !location || !location.address || !location.city) {
      return res.status(400).json({
        success: false,
        message: 'Please provide theatre name, address, and city',
      });
    }

    // Default screens if none provided
    const screensList =
      screens && screens.length > 0
        ? screens
        : [
            {
              screenNumber: 1,
              name: 'Screen 1 (Audi A - 4K Laser)',
              totalSeats: 60,
              vipRows: ['A', 'B'],
              premiumRows: ['C', 'D'],
              standardRows: ['E', 'F'],
              seatsPerRow: 10,
            },
            {
              screenNumber: 2,
              name: 'Screen 2 (Audi B - Dolby Atmos)',
              totalSeats: 60,
              vipRows: ['A', 'B'],
              premiumRows: ['C', 'D'],
              standardRows: ['E', 'F'],
              seatsPerRow: 10,
            },
          ];

    const theatre = await Theatre.create({
      name,
      location,
      screens: screensList,
      amenities: amenities || ['Dolby Atmos', '4K Projection', 'Cafeteria', 'Parking'],
      phone: phone || '',
    });

    res.status(201).json({
      success: true,
      message: 'Theatre created successfully',
      theatre,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update theatre (Admin)
// @route   PUT /api/theatres/:id
// @access  Private/Admin
exports.updateTheatre = async (req, res, next) => {
  try {
    let theatre = await Theatre.findById(req.params.id);

    if (!theatre) {
      return res.status(404).json({
        success: false,
        message: 'Theatre not found',
      });
    }

    theatre = await Theatre.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Theatre updated successfully',
      theatre,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete theatre (Admin)
// @route   DELETE /api/theatres/:id
// @access  Private/Admin
exports.deleteTheatre = async (req, res, next) => {
  try {
    const theatre = await Theatre.findById(req.params.id);

    if (!theatre) {
      return res.status(404).json({
        success: false,
        message: 'Theatre not found',
      });
    }

    await Show.deleteMany({ theatre: theatre._id });
    await theatre.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Theatre and its scheduled shows removed successfully',
    });
  } catch (err) {
    next(err);
  }
};

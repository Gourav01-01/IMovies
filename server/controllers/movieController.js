const Movie = require('../models/Movie');
const Show = require('../models/Show');
const Theatre = require('../models/Theatre');

// @desc    Get all movies with filters & pagination
// @route   GET /api/movies
// @access  Public
exports.getMovies = async (req, res, next) => {
  try {
    const {
      search,
      genre,
      language,
      status,
      city,
      theatre,
      sort,
      page = 1,
      limit = 12,
    } = req.query;

    const query = {};

    // Filter by status (now_showing, coming_soon)
    if (status) {
      query.status = status;
    }

    // Filter by genre
    if (genre && genre !== 'All') {
      query.genre = { $in: [new RegExp(genre, 'i')] };
    }

    // Filter by language
    if (language && language !== 'All') {
      query.language = new RegExp(`^${language}$`, 'i');
    }

    // Text search on title and description
    if (search && search.trim()) {
      query.$or = [
        { title: { $regex: search.trim(), $options: 'i' } },
        { description: { $regex: search.trim(), $options: 'i' } },
        { cast: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    // If city filter is applied, only show movies that have upcoming shows in theatres of that city
    if (city && city !== 'All') {
      const theatresInCity = await Theatre.find({
        'location.city': { $regex: new RegExp(`^${city}$`, 'i') },
      }).select('_id');
      const theatreIds = theatresInCity.map((t) => t._id);

      const activeShowsInCity = await Show.find({
        theatre: { $in: theatreIds },
        showTime: { $gte: new Date() },
        isCancelled: false,
      }).distinct('movie');

      query._id = { $in: activeShowsInCity };
    }

    // If specific theatre is filtered
    if (theatre && theatre !== 'All') {
      const activeShowsInTheatre = await Show.find({
        theatre,
        showTime: { $gte: new Date() },
        isCancelled: false,
      }).distinct('movie');

      if (query._id) {
        query._id = {
          $in: activeShowsInTheatre.filter((id) =>
            query._id.$in.some((qId) => qId.toString() === id.toString())
          ),
        };
      } else {
        query._id = { $in: activeShowsInTheatre };
      }
    }

    // Sorting
    let sortQuery = { releaseDate: -1 };
    if (sort === 'rating') {
      sortQuery = { rating: -1 };
    } else if (sort === 'title_asc') {
      sortQuery = { title: 1 };
    } else if (sort === 'release_date') {
      sortQuery = { releaseDate: -1 };
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 12;
    const skip = (pageNum - 1) * limitNum;

    const total = await Movie.countDocuments(query);
    const movies = await Movie.find(query)
      .sort(sortQuery)
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      count: movies.length,
      total,
      totalPages: Math.ceil(total / limitNum) || 1,
      currentPage: pageNum,
      movies,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single movie by ID with upcoming shows grouped by theatre
// @route   GET /api/movies/:id
// @access  Public
exports.getMovieById = async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params.id);

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found',
      });
    }

    // Fetch upcoming shows for this movie
    const { city, date } = req.query;
    const showQuery = {
      movie: movie._id,
      isCancelled: false,
    };

    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      showQuery.showTime = { $gte: startOfDay, $lte: endOfDay };
    } else {
      // Default: shows starting now or in the future
      showQuery.showTime = { $gte: new Date(Date.now() - 30 * 60 * 1000) };
    }

    let shows = await Show.find(showQuery)
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

    // Group shows by Theatre
    const theatreMap = new Map();
    for (const show of shows) {
      if (!show.theatre) continue;
      const tId = show.theatre._id.toString();
      if (!theatreMap.has(tId)) {
        theatreMap.set(tId, {
          theatre: show.theatre,
          shows: [],
        });
      }
      theatreMap.get(tId).shows.push({
        _id: show._id,
        screenName: show.screenName,
        showTime: show.showTime,
        pricing: show.pricing,
        availableSeatsCount:
          (show.seatLayout?.length || 60) - (show.bookedSeats?.length || 0),
        totalSeatsCount: show.seatLayout?.length || 60,
      });
    }

    const groupedShows = Array.from(theatreMap.values());

    res.status(200).json({
      success: true,
      movie,
      groupedShows,
      totalShows: shows.length,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get dynamic filters (genres, languages, cities)
// @route   GET /api/movies/filters/all
// @access  Public
exports.getMovieFilters = async (req, res, next) => {
  try {
    const genres = await Movie.distinct('genre');
    const languages = await Movie.distinct('language');
    const cities = await Theatre.distinct('location.city');

    res.status(200).json({
      success: true,
      genres: genres.sort(),
      languages: languages.sort(),
      cities: cities.sort(),
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create new movie (Admin)
// @route   POST /api/movies
// @access  Private/Admin
exports.createMovie = async (req, res, next) => {
  try {
    const {
      title,
      description,
      poster,
      backdrop,
      genre,
      language,
      runtime,
      rating,
      releaseDate,
      status,
      trailerUrl,
      director,
      cast,
      certificate,
    } = req.body;

    let finalPoster = poster;
    if (req.file) {
      finalPoster = `/uploads/${req.file.filename}`;
    }

    if (!finalPoster) {
      return res.status(400).json({
        success: false,
        message: 'Poster image or URL is required',
      });
    }

    const parsedGenre = Array.isArray(genre)
      ? genre
      : typeof genre === 'string'
      ? genre.split(',').map((g) => g.trim())
      : [];

    const parsedCast = Array.isArray(cast)
      ? cast
      : typeof cast === 'string'
      ? cast.split(',').map((c) => c.trim())
      : [];

    const movie = await Movie.create({
      title,
      description,
      poster: finalPoster,
      backdrop: backdrop || finalPoster,
      genre: parsedGenre,
      language,
      runtime: Number(runtime),
      rating: rating ? Number(rating) : 8.0,
      releaseDate: releaseDate ? new Date(releaseDate) : new Date(),
      status: status || 'now_showing',
      trailerUrl: trailerUrl || '',
      director: director || '',
      cast: parsedCast,
      certificate: certificate || 'UA',
    });

    res.status(201).json({
      success: true,
      message: 'Movie created successfully',
      movie,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update movie (Admin)
// @route   PUT /api/movies/:id
// @access  Private/Admin
exports.updateMovie = async (req, res, next) => {
  try {
    let movie = await Movie.findById(req.params.id);

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found',
      });
    }

    const updateData = { ...req.body };
    if (req.file) {
      updateData.poster = `/uploads/${req.file.filename}`;
    }

    if (updateData.genre && typeof updateData.genre === 'string') {
      updateData.genre = updateData.genre.split(',').map((g) => g.trim());
    }
    if (updateData.cast && typeof updateData.cast === 'string') {
      updateData.cast = updateData.cast.split(',').map((c) => c.trim());
    }

    movie = await Movie.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Movie updated successfully',
      movie,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete movie (Admin)
// @route   DELETE /api/movies/:id
// @access  Private/Admin
exports.deleteMovie = async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params.id);

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found',
      });
    }

    // Delete associated shows
    await Show.deleteMany({ movie: movie._id });
    await movie.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Movie and associated shows deleted successfully',
    });
  } catch (err) {
    next(err);
  }
};

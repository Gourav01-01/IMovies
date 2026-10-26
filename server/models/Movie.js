const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide movie title'],
      trim: true,
      maxlength: [120, 'Title cannot exceed 120 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please provide movie description / synopsis'],
      trim: true,
    },
    poster: {
      type: String,
      required: [true, 'Please provide poster image URL'],
    },
    backdrop: {
      type: String,
      default: '',
    },
    genre: {
      type: [String],
      required: [true, 'Please provide at least one genre'],
      index: true,
    },
    language: {
      type: String,
      required: [true, 'Please provide language'],
      trim: true,
      index: true,
    },
    runtime: {
      type: Number,
      required: [true, 'Please provide runtime in minutes'],
    },
    rating: {
      type: Number,
      default: 8.0,
      min: [0, 'Rating cannot be less than 0'],
      max: [10, 'Rating cannot be greater than 10'],
    },
    releaseDate: {
      type: Date,
      required: [true, 'Please provide release date'],
    },
    status: {
      type: String,
      enum: ['now_showing', 'coming_soon'],
      default: 'now_showing',
      index: true,
    },
    trailerUrl: {
      type: String,
      default: '',
    },
    director: {
      type: String,
      default: '',
    },
    cast: {
      type: [String],
      default: [],
    },
    certificate: {
      type: String,
      enum: ['U', 'UA', 'A', 'PG', 'PG-13', 'R'],
      default: 'UA',
    },
  },
  {
    timestamps: true,
  }
);

movieSchema.index(
  { title: 'text', description: 'text' },
  { language_override: 'none' }
);

module.exports = mongoose.model('Movie', movieSchema);

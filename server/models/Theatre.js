const mongoose = require('mongoose');

const screenSchema = new mongoose.Schema({
  screenNumber: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true, // e.g. "Screen 1 - IMAX 4K", "Screen 2 - Atmos"
  },
  totalSeats: {
    type: Number,
    default: 60,
  },
  vipRows: {
    type: [String],
    default: ['A', 'B'],
  },
  premiumRows: {
    type: [String],
    default: ['C', 'D'],
  },
  standardRows: {
    type: [String],
    default: ['E', 'F'],
  },
  seatsPerRow: {
    type: Number,
    default: 10,
  },
});

const theatreSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide theatre name'],
      trim: true,
    },
    location: {
      address: {
        type: String,
        required: [true, 'Please provide street address'],
      },
      city: {
        type: String,
        required: [true, 'Please provide city'],
        index: true,
      },
      state: {
        type: String,
        default: '',
      },
      pincode: {
        type: String,
        default: '',
      },
    },
    screens: [screenSchema],
    amenities: {
      type: [String],
      default: ['Dolby Atmos', '4K Projection', 'Snack Bar', 'Parking'],
    },
    phone: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

theatreSchema.index({ 'location.city': 1, name: 1 });

module.exports = mongoose.model('Theatre', theatreSchema);

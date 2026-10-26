const mongoose = require('mongoose');

const seatSchema = new mongoose.Schema(
  {
    row: {
      type: String,
      required: true,
    },
    number: {
      type: Number,
      required: true,
    },
    seatNumber: {
      type: String,
      required: true, // e.g. "A1", "B5"
    },
    seatType: {
      type: String,
      enum: ['vip', 'premium', 'standard'],
      default: 'standard',
    },
    price: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['available', 'locked', 'booked'],
      default: 'available',
    },
    lockedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    lockedUntil: {
      type: Date,
      default: null,
    },
  },
  { _id: false }
);

const showSchema = new mongoose.Schema(
  {
    movie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Movie',
      required: [true, 'Please provide movie reference'],
      index: true,
    },
    theatre: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Theatre',
      required: [true, 'Please provide theatre reference'],
      index: true,
    },
    screenName: {
      type: String,
      required: [true, 'Please specify screen name'],
    },
    showTime: {
      type: Date,
      required: [true, 'Please provide show date and time'],
      index: true,
    },
    pricing: {
      vip: { type: Number, default: 350 },
      premium: { type: Number, default: 250 },
      standard: { type: Number, default: 180 },
    },
    seatLayout: [seatSchema],
    bookedSeats: {
      type: [String],
      default: [],
    },
    isCancelled: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Method to generate default seat layout if not provided
showSchema.methods.generateSeatLayout = function () {
  const layout = [];
  const rows = [
    { row: 'A', type: 'vip', price: this.pricing.vip },
    { row: 'B', type: 'vip', price: this.pricing.vip },
    { row: 'C', type: 'premium', price: this.pricing.premium },
    { row: 'D', type: 'premium', price: this.pricing.premium },
    { row: 'E', type: 'standard', price: this.pricing.standard },
    { row: 'F', type: 'standard', price: this.pricing.standard },
  ];
  const seatsPerRow = 10;

  for (const r of rows) {
    for (let i = 1; i <= seatsPerRow; i++) {
      const seatNumber = `${r.row}${i}`;
      const isBooked = this.bookedSeats.includes(seatNumber);
      layout.push({
        row: r.row,
        number: i,
        seatNumber,
        seatType: r.type,
        price: r.price,
        status: isBooked ? 'booked' : 'available',
        lockedBy: null,
        lockedUntil: null,
      });
    }
  }

  this.seatLayout = layout;
  return layout;
};

showSchema.index({ movie: 1, theatre: 1, showTime: 1 });

module.exports = mongoose.model('Show', showSchema);

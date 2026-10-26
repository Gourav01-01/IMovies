require('dotenv').config();
const { connectDB, closeDB } = require('../config/db');
const User = require('../models/User');
const Movie = require('../models/Movie');
const Theatre = require('../models/Theatre');
const Show = require('../models/Show');
const Booking = require('../models/Booking');
const seedData = require('./seedData');

const runSeed = async () => {
  try {
    console.log('[Seed] Connecting to MongoDB...');
    await connectDB();

    console.log('[Seed] Clearing existing collections...');
    await Booking.deleteMany({});
    await Show.deleteMany({});
    await Theatre.deleteMany({});
    await Movie.deleteMany({});
    await User.deleteMany({});

    console.log('[Seed] Seeding Users...');
    const createdUsers = [];
    for (const u of seedData.users) {
      const user = await User.create(u);
      createdUsers.push(user);
    }
    const adminUser = createdUsers.find((u) => u.role === 'admin');
    const regularUser = createdUsers.find((u) => u.role === 'user');

    console.log(`[Seed] Seeded ${createdUsers.length} users. Admin: ${adminUser.email}`);

    console.log('[Seed] Seeding Theatres...');
    const createdTheatres = await Theatre.insertMany(seedData.theatres);
    console.log(`[Seed] Seeded ${createdTheatres.length} theatres.`);

    console.log('[Seed] Seeding Movies...');
    const createdMovies = await Movie.insertMany(seedData.movies);
    console.log(`[Seed] Seeded ${createdMovies.length} movies.`);

    console.log('[Seed] Generating Dynamic Shows across Theatres...');
    const timeSlots = [
      { hours: 10, minutes: 30 },
      { hours: 14, minutes: 0 },
      { hours: 17, minutes: 45 },
      { hours: 21, minutes: 15 },
    ];

    const createdShows = [];
    const now = new Date();

    // Generate shows for Day 0 (today), Day 1 (tomorrow), Day 2, Day 3
    for (let dayOffset = 0; dayOffset <= 3; dayOffset++) {
      for (const theatre of createdTheatres) {
        for (const movie of createdMovies) {
          if (movie.status === 'coming_soon') continue;

          // Pick 2 slots for each movie in each theatre per day
          const selectedSlots = dayOffset % 2 === 0 ? [timeSlots[1], timeSlots[3]] : [timeSlots[0], timeSlots[2]];

          for (let slotIndex = 0; slotIndex < selectedSlots.length; slotIndex++) {
            const slot = selectedSlots[slotIndex];
            const showDate = new Date();
            showDate.setDate(now.getDate() + dayOffset);
            showDate.setHours(slot.hours, slot.minutes, 0, 0);

            // Skip shows that are already in the past on day 0
            if (showDate < now) {
              showDate.setHours(now.getHours() + 2 + slotIndex, 30, 0, 0);
            }

            const screen = theatre.screens[slotIndex % theatre.screens.length];

            // Some initial booked seats to demonstrate realistic availability
            const sampleBooked = dayOffset === 0 ? ['C4', 'C5', 'D5', 'D6', 'B2', 'B3'] : ['C5', 'C6'];

            const show = new Show({
              movie: movie._id,
              theatre: theatre._id,
              screenName: screen.name,
              showTime: showDate,
              pricing: {
                vip: 350,
                premium: 250,
                standard: 180,
              },
              bookedSeats: sampleBooked,
            });

            show.generateSeatLayout();
            await show.save();
            createdShows.push(show);
          }
        }
      }
    }

    console.log(`[Seed] Generated ${createdShows.length} dynamic shows with seat maps.`);

    // Create a sample booking for regularUser so they have a booking history
    if (createdShows.length > 0 && regularUser) {
      const sampleShow = createdShows[0];
      const sampleBooking = await Booking.create({
        bookingId: 'IMV-982410',
        user: regularUser._id,
        show: sampleShow._id,
        movie: sampleShow.movie,
        theatre: sampleShow.theatre,
        seats: [
          { seatNumber: 'C4', seatType: 'premium', price: 250 },
          { seatNumber: 'C5', seatType: 'premium', price: 250 },
        ],
        subtotal: 500,
        convenienceFee: 55,
        discount: 50,
        totalAmount: 505,
        paymentStatus: 'completed',
        paymentMethod: 'demo_card',
        paymentId: 'TXN_DEMO_SAMPLE_102938',
        bookingStatus: 'confirmed',
        bookingDate: new Date(),
      });
      console.log(`[Seed] Created sample booking for user (${sampleBooking.bookingId}).`);
    }

    console.log('----------------------------------------------------');
    console.log('✅ Database Seeded Successfully!');
    console.log('Admin Credentials: admin@imovies.com / adminpassword123');
    console.log('User Credentials:  john@example.com  / password123');
    console.log('----------------------------------------------------');

    if (require.main === module) {
      await closeDB();
      process.exit(0);
    }
  } catch (err) {
    console.error('❌ Error during database seeding:', err);
    if (require.main === module) {
      await closeDB();
      process.exit(1);
    }
    throw err;
  }
};

if (require.main === module) {
  runSeed();
}

module.exports = runSeed;

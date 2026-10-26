// Real-time seat updates & room management
const initSeatSocket = (io) => {
  // Map of showId -> { seatNumber -> { userId, timestamp } }
  const tempSeatLocks = new Map();

  io.on('connection', (socket) => {
    // When a user opens the Seat Selection page for a show
    socket.on('join_show', ({ showId, userId }) => {
      socket.join(`show_${showId}`);
      socket.currentShowId = showId;
      socket.userId = userId;

      // Send currently soft-held seats in memory
      const showLocks = tempSeatLocks.get(showId) || {};
      const activeSoftLocks = Object.keys(showLocks);
      socket.emit('initial_soft_locks', { showId, softLockedSeats: activeSoftLocks });
    });

    // When a user selects/holds a seat in real-time
    socket.on('lock_seat', ({ showId, seatNumber, userId }) => {
      if (!tempSeatLocks.has(showId)) {
        tempSeatLocks.set(showId, {});
      }
      const showLocks = tempSeatLocks.get(showId);
      showLocks[seatNumber] = { userId, timestamp: Date.now() };

      // Broadcast to all other users in this show's room
      socket.to(`show_${showId}`).emit('seat_locked', {
        showId,
        seatNumber,
        byUser: userId,
      });
    });

    // When a user unselects a seat
    socket.on('unlock_seat', ({ showId, seatNumber }) => {
      const showLocks = tempSeatLocks.get(showId);
      if (showLocks && showLocks[seatNumber]) {
        delete showLocks[seatNumber];
        socket.to(`show_${showId}`).emit('seat_unlocked', {
          showId,
          seatNumber,
        });
      }
    });

    // Leave show room
    socket.on('leave_show', ({ showId }) => {
      socket.leave(`show_${showId}`);
    });

    // On disconnect, release their soft locks
    socket.on('disconnect', () => {
      if (socket.currentShowId && socket.userId) {
        const showLocks = tempSeatLocks.get(socket.currentShowId);
        if (showLocks) {
          Object.keys(showLocks).forEach((seatNum) => {
            if (showLocks[seatNum]?.userId === socket.userId) {
              delete showLocks[seatNum];
              socket.to(`show_${socket.currentShowId}`).emit('seat_unlocked', {
                showId: socket.currentShowId,
                seatNumber: seatNum,
              });
            }
          });
        }
      }
    });
  });
};

module.exports = initSeatSocket;

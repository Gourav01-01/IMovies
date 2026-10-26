import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    // In dev, with Vite proxy or direct port 5000
    const socketInstance = io('/', {
      transports: ['websocket', 'polling'],
      autoConnect: true,
    });

    socketInstance.on('connect', () => {
      setConnected(true);
    });

    socketInstance.on('disconnect', () => {
      setConnected(false);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  const joinShow = (showId) => {
    if (socket && showId) {
      socket.emit('join_show', { showId, userId: user?._id || user?.id });
    }
  };

  const leaveShow = (showId) => {
    if (socket && showId) {
      socket.emit('leave_show', { showId });
    }
  };

  const lockSeat = (showId, seatNumber) => {
    if (socket && showId && seatNumber) {
      socket.emit('lock_seat', { showId, seatNumber, userId: user?._id || user?.id });
    }
  };

  const unlockSeat = (showId, seatNumber) => {
    if (socket && showId && seatNumber) {
      socket.emit('unlock_seat', { showId, seatNumber });
    }
  };

  return (
    <SocketContext.Provider
      value={{
        socket,
        connected,
        joinShow,
        leaveShow,
        lockSeat,
        unlockSeat,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

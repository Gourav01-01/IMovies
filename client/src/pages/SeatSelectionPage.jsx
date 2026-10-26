import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { showApi } from '../api/showApi';
import { bookingApi } from '../api/bookingApi';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';
import SeatMap from '../components/booking/SeatMap';
import BookingSummary from '../components/booking/BookingSummary';
import DemoPaymentModal from '../components/booking/DemoPaymentModal';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { ChevronLeft, AlertCircle, Wifi, WifiOff } from 'lucide-react';

const SeatSelectionPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { socket, connected, joinShow, leaveShow, lockSeat, unlockSeat } = useSocket();

  const [show, setShow] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Payment Modal state
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const [checkoutData, setCheckoutData] = useState(null);

  // Fetch show details
  useEffect(() => {
    const fetchShow = async () => {
      try {
        setLoading(true);
        const res = await showApi.getShowById(id);
        setShow(res.show);
      } catch (err) {
        setError('Failed to load showtime. It may have expired or been removed.');
      } finally {
        setLoading(false);
      }
    };
    fetchShow();
  }, [id]);

  // Socket.IO Room & Real-time Listeners
  useEffect(() => {
    if (!id) return;
    joinShow(id);

    if (socket) {
      // Handle when seats are booked by another user
      const handleSeatsUpdated = ({ showId, bookedSeats, newlyBooked }) => {
        if (showId === id) {
          setShow((prev) => {
            if (!prev) return prev;
            const updatedLayout = prev.seatLayout.map((seat) => {
              if (bookedSeats.includes(seat.seatNumber)) {
                return { ...seat, status: 'booked' };
              }
              return seat;
            });
            return { ...prev, bookedSeats, seatLayout: updatedLayout };
          });

          // If current user had selected one of the newly booked seats, deselect it and warn
          if (newlyBooked && Array.isArray(newlyBooked)) {
            setSelectedSeats((prevSelected) => {
              const conflict = prevSelected.filter((s) => newlyBooked.includes(s.seatNumber));
              if (conflict.length > 0) {
                alert(`Seats ${conflict.map((c) => c.seatNumber).join(', ')} were just confirmed by another guest.`);
              }
              return prevSelected.filter((s) => !newlyBooked.includes(s.seatNumber));
            });
          }
        }
      };

      socket.on('seats_updated', handleSeatsUpdated);

      return () => {
        socket.off('seats_updated', handleSeatsUpdated);
        leaveShow(id);
      };
    }
  }, [id, socket]);

  // Toggle seat selection
  const handleSeatToggle = (seat) => {
    const isAlreadySelected = selectedSeats.some((s) => s.seatNumber === seat.seatNumber);

    if (isAlreadySelected) {
      // Unselect
      setSelectedSeats(selectedSeats.filter((s) => s.seatNumber !== seat.seatNumber));
      unlockSeat(id, seat.seatNumber);
    } else {
      // Select - max 8 seats
      if (selectedSeats.length >= 8) {
        alert('You can select a maximum of 8 seats per booking.');
        return;
      }
      setSelectedSeats([...selectedSeats, { seatNumber: seat.seatNumber, seatType: seat.seatType, price: seat.price }]);
      lockSeat(id, seat.seatNumber);
    }
  };

  // Open demo payment modal
  const handleProceedToPayment = (data) => {
    if (!user) {
      navigate('/login', { state: { from: `/booking/${id}` } });
      return;
    }
    setCheckoutData(data);
    setPaymentError('');
    setPaymentModalOpen(true);
  };

  // Confirm booking & demo payment
  const handleConfirmPayment = async ({ paymentMethod }) => {
    try {
      setPaymentLoading(true);
      setPaymentError('');

      // Simulated network/processing delay for realistic experience
      await new Promise((r) => setTimeout(r, 900));

      const payload = {
        showId: id,
        seats: selectedSeats,
        paymentMethod,
        couponCode: checkoutData?.couponCode || '',
      };

      const res = await bookingApi.createBooking(payload);

      setPaymentModalOpen(false);
      navigate(`/confirmation/${res.booking._id}`, { state: { booking: res.booking } });
    } catch (err) {
      setPaymentError(err.message || 'Payment processing failed. Please try again.');
    } finally {
      setPaymentLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen text="Preparing live interactive seat layout..." />;
  }

  if (error || !show) {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
        <h2 style={{ color: '#ef4444', marginBottom: '1rem' }}>{error || 'Showtime unavailable'}</h2>
        <Link to="/movies" className="btn-primary">
          Back to Movies
        </Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '2rem 1.5rem 5rem 1.5rem' }}>
      {/* Top Header / Breadcrumb */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.75rem',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <Link
          to={`/movies/${show.movie?._id}`}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            color: '#94a3b8',
            fontSize: '0.9rem',
            fontWeight: 600,
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}
        >
          <ChevronLeft size={18} />
          <span>Change Showtime / Details</span>
        </Link>

        {/* Live sync indicator */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            fontSize: '0.78rem',
            color: connected ? '#34d399' : '#94a3b8',
            backgroundColor: connected ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255, 255, 255, 0.05)',
            border: `1px solid ${connected ? 'rgba(16, 185, 129, 0.25)' : 'rgba(255, 255, 255, 0.08)'}`,
            padding: '0.3rem 0.75rem',
            borderRadius: '9999px',
          }}
        >
          {connected ? <Wifi size={13} /> : <WifiOff size={13} />}
          <span>{connected ? 'Real-time Seat Sync Active' : 'Connecting Sync...'}</span>
        </div>
      </div>

      {/* Main Grid: Seat Map on Left, Summary on Right */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr minmax(320px, 380px)',
          gap: '2rem',
          alignItems: 'start',
        }}
        className="seat-selection-layout"
      >
        {/* Left: Seat Map */}
        <div>
          <SeatMap
            seatLayout={show.seatLayout || []}
            selectedSeats={selectedSeats}
            onSeatToggle={handleSeatToggle}
            pricing={show.pricing}
            maxSeats={8}
          />
        </div>

        {/* Right: Booking Summary Sidebar */}
        <div>
          <BookingSummary
            movie={show.movie}
            theatre={show.theatre}
            show={show}
            selectedSeats={selectedSeats}
            onProceed={handleProceedToPayment}
            loading={paymentLoading}
          />
        </div>
      </div>

      {/* Demo Payment Modal */}
      <DemoPaymentModal
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        totalAmount={checkoutData?.totalAmount || 0}
        selectedSeatsCount={selectedSeats.length}
        onConfirmPayment={handleConfirmPayment}
        loading={paymentLoading}
        error={paymentError}
      />

      <style>{`
        @media (max-width: 900px) {
          .seat-selection-layout {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default SeatSelectionPage;

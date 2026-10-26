import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { bookingApi } from '../api/bookingApi';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Modal from '../components/common/Modal';
import {
  Ticket,
  Calendar,
  MapPin,
  Clock,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

const MyBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState('upcoming'); // 'upcoming' | 'past'
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBookings, setTotalBookings] = useState(0);
  const [loading, setLoading] = useState(true);

  // Cancellation modal state
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [selectedBookingToCancel, setSelectedBookingToCancel] = useState(null);
  const [cancelReason, setCancelReason] = useState('Change of plans');
  const [cancelling, setCancelling] = useState(false);
  const [cancelMessage, setCancelMessage] = useState('');

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await bookingApi.getMyBookings({ page, limit: 8 });
      setBookings(res.bookings || []);
      setTotalPages(res.totalPages || 1);
      setTotalBookings(res.total || 0);
    } catch (err) {
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [page]);

  const now = new Date();

  // Filter based on active tab
  const upcomingBookings = bookings.filter((b) => {
    const showTime = b.show?.showTime ? new Date(b.show.showTime) : new Date(b.bookingDate);
    return b.bookingStatus === 'confirmed' && showTime >= now;
  });

  const pastOrCancelledBookings = bookings.filter((b) => {
    const showTime = b.show?.showTime ? new Date(b.show.showTime) : new Date(b.bookingDate);
    return b.bookingStatus === 'cancelled' || showTime < now;
  });

  const displayedBookings = activeTab === 'upcoming' ? upcomingBookings : pastOrCancelledBookings;

  const handleOpenCancelModal = (booking) => {
    setSelectedBookingToCancel(booking);
    setCancelMessage('');
    setCancelModalOpen(true);
  };

  const handleConfirmCancel = async () => {
    if (!selectedBookingToCancel) return;
    try {
      setCancelling(true);
      await bookingApi.cancelBooking(selectedBookingToCancel._id, { reason: cancelReason });
      setCancelMessage('Booking successfully cancelled. Seats have been released.');
      await fetchBookings();
      setTimeout(() => {
        setCancelModalOpen(false);
      }, 1200);
    } catch (err) {
      alert(err.message || 'Failed to cancel booking');
    } finally {
      setCancelling(false);
    }
  };

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem 5rem 1.5rem', maxWidth: '960px' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '2.2rem',
            fontWeight: 800,
            color: '#fff',
            marginBottom: '0.4rem',
          }}
        >
          My Movie Passes & Tickets
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>
          Access your digital admission passes, view upcoming show details, or cancel eligible tickets.
        </p>
      </div>

      {/* Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          paddingBottom: '0.5rem',
          marginBottom: '2rem',
        }}
      >
        <button
          onClick={() => setActiveTab('upcoming')}
          style={{
            padding: '0.65rem 1.25rem',
            borderRadius: '10px',
            fontWeight: 700,
            fontSize: '0.9rem',
            color: activeTab === 'upcoming' ? '#fff' : '#94a3b8',
            backgroundColor: activeTab === 'upcoming' ? '#e50914' : 'transparent',
            transition: 'all 150ms',
            boxShadow: activeTab === 'upcoming' ? '0 4px 14px rgba(229, 9, 20, 0.35)' : 'none',
          }}
        >
          Upcoming Shows ({upcomingBookings.length})
        </button>

        <button
          onClick={() => setActiveTab('past')}
          style={{
            padding: '0.65rem 1.25rem',
            borderRadius: '10px',
            fontWeight: 700,
            fontSize: '0.9rem',
            color: activeTab === 'past' ? '#fff' : '#94a3b8',
            backgroundColor: activeTab === 'past' ? '#e50914' : 'transparent',
            transition: 'all 150ms',
            boxShadow: activeTab === 'past' ? '0 4px 14px rgba(229, 9, 20, 0.35)' : 'none',
          }}
        >
          Past & Cancelled ({pastOrCancelledBookings.length})
        </button>
      </div>

      {/* Bookings List */}
      {loading ? (
        <LoadingSpinner text="Retrieving your cinema passes..." />
      ) : displayedBookings.length === 0 ? (
        <div
          className="glass-panel"
          style={{
            padding: '4rem 2rem',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem',
          }}
        >
          <Ticket size={48} color="#64748b" />
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', color: '#fff' }}>
            {activeTab === 'upcoming' ? 'No upcoming tickets found' : 'No past bookings found'}
          </h3>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', maxWidth: '380px' }}>
            Ready for a movie night? Browse what's now playing and pick your favorite seats.
          </p>
          <Link to="/movies" className="btn-primary" style={{ marginTop: '0.5rem' }}>
            Browse Movies
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {displayedBookings.map((b) => {
            const showTime = b.show?.showTime ? new Date(b.show.showTime) : new Date(b.bookingDate);
            const dateStr = showTime.toLocaleDateString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
            });
            const timeStr = showTime.toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
            });

            const isCancelled = b.bookingStatus === 'cancelled';
            const canCancel = !isCancelled && showTime.getTime() - now.getTime() > 30 * 60 * 1000;

            return (
              <div
                key={b._id}
                className="glass-panel fade-in"
                style={{
                  padding: '1.5rem',
                  borderRadius: '18px',
                  display: 'flex',
                  gap: '1.5rem',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  borderLeft: isCancelled ? '4px solid #ef4444' : '4px solid #10b981',
                }}
              >
                {/* Poster */}
                <img
                  src={b.movie?.poster}
                  alt={b.movie?.title}
                  style={{
                    width: '85px',
                    aspectRatio: '2/3',
                    objectFit: 'cover',
                    borderRadius: '10px',
                    backgroundColor: '#151b28',
                    flexShrink: 0,
                  }}
                />

                {/* Ticket Details */}
                <div style={{ flex: '1 1 280px', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '0.85rem', color: '#ffb703' }}>
                      {b.bookingId}
                    </span>
                    <span className={`badge ${isCancelled ? 'badge-crimson' : 'badge-emerald'}`}>
                      {isCancelled ? 'Cancelled / Refunded' : 'Confirmed'}
                    </span>
                  </div>

                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 700, color: '#fff' }}>
                    {b.movie?.title}
                  </h3>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#cbd5e1', fontSize: '0.85rem' }}>
                    <MapPin size={14} color="#e50914" />
                    <span>{b.theatre?.name} — {b.show?.screenName}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#94a3b8', fontSize: '0.85rem' }}>
                    <Calendar size={14} color="#e50914" />
                    <span>{dateStr} at {timeStr}</span>
                  </div>

                  {/* Seats badge */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.2rem', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>Seats:</span>
                    {b.seats?.map((seat, i) => (
                      <span key={i} className="badge badge-amber" style={{ fontSize: '0.75rem' }}>
                        {seat.seatNumber}
                      </span>
                    ))}
                    <span style={{ fontSize: '0.82rem', color: '#fff', fontWeight: 700, marginLeft: '0.5rem' }}>
                      ${b.totalAmount}
                    </span>
                  </div>
                </div>

                {/* Action buttons */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flexShrink: 0 }}>
                  <Link
                    to={`/confirmation/${b._id}`}
                    className="btn-secondary"
                    style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                  >
                    <ExternalLink size={15} />
                    <span>View Pass</span>
                  </Link>

                  {canCancel && (
                    <button
                      type="button"
                      onClick={() => handleOpenCancelModal(b)}
                      className="btn-danger"
                    >
                      <span>Cancel Ticket</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      <Modal
        isOpen={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        title="Cancel Ticket & Release Seats"
        maxWidth="460px"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div
            style={{
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.25)',
              borderRadius: '12px',
              padding: '1rem',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.75rem',
            }}
          >
            <AlertTriangle size={20} color="#ef4444" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>
              Are you sure you want to cancel booking{' '}
              <strong style={{ color: '#fff' }}>{selectedBookingToCancel?.bookingId}</strong>?
              Your seats ({selectedBookingToCancel?.seats?.map((s) => s.seatNumber).join(', ')}) will be immediately re-released for other guests.
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Reason for cancellation</label>
            <select
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              className="form-select"
            >
              <option value="Change of plans">Change of plans</option>
              <option value="Booked wrong showtime or cinema">Booked wrong showtime or cinema</option>
              <option value="Friend cannot attend">Friend cannot attend</option>
              <option value="Other">Other reason</option>
            </select>
          </div>

          {cancelMessage ? (
            <div style={{ color: '#10b981', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <CheckCircle2 size={16} />
              <span>{cancelMessage}</span>
            </div>
          ) : (
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={() => setCancelModalOpen(false)}
                className="btn-secondary"
              >
                Keep Tickets
              </button>
              <button
                type="button"
                disabled={cancelling}
                onClick={handleConfirmCancel}
                className="btn-danger"
              >
                {cancelling ? 'Releasing Seats...' : 'Confirm Cancellation'}
              </button>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default MyBookingsPage;

import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { bookingApi } from '../api/bookingApi';
import LoadingSpinner from '../components/common/LoadingSpinner';
import {
  CheckCircle2,
  Ticket,
  Calendar,
  MapPin,
  Clock,
  Printer,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  QrCode,
} from 'lucide-react';

const BookingConfirmationPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const [booking, setBooking] = useState(location.state?.booking || null);
  const [loading, setLoading] = useState(!booking);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!booking && id) {
      const fetchBooking = async () => {
        try {
          setLoading(true);
          const res = await bookingApi.getBookingById(id);
          setBooking(res.booking);
        } catch (err) {
          setError('Failed to load booking details.');
        } finally {
          setLoading(false);
        }
      };
      fetchBooking();
    }
  }, [id, booking]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return <LoadingSpinner fullScreen text="Issuing your cinema e-ticket..." />;
  }

  if (error || !booking) {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
        <h2 style={{ color: '#ef4444', marginBottom: '1rem' }}>{error || 'Booking not found'}</h2>
        <Link to="/my-bookings" className="btn-primary">
          View My Bookings
        </Link>
      </div>
    );
  }

  const showDate = booking.show?.showTime ? new Date(booking.show.showTime) : new Date(booking.bookingDate);
  const dateFormatted = showDate.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  const timeFormatted = showDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem 5rem 1.5rem', maxWidth: '780px' }}>
      {/* Success Banner */}
      <div
        className="fade-in"
        style={{
          textAlign: 'center',
          marginBottom: '2rem',
        }}
      >
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: 'rgba(16, 185, 129, 0.15)',
            border: '2px solid rgba(16, 185, 129, 0.4)',
            color: '#10b981',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem auto',
            boxShadow: '0 0 30px rgba(16, 185, 129, 0.3)',
          }}
        >
          <CheckCircle2 size={36} />
        </div>
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '2rem',
            fontWeight: 800,
            color: '#fff',
            marginBottom: '0.4rem',
          }}
        >
          Booking Confirmed!
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>
          Your digital admission pass is ready. Please present this e-ticket at the cinema entrance.
        </p>
      </div>

      {/* Ticket Pass Container */}
      <div
        id="cinema-ticket-pass"
        className="glass-panel fade-in"
        style={{
          borderRadius: '24px',
          overflow: 'hidden',
          backgroundColor: '#0c101a',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.9), 0 0 40px rgba(229, 9, 20, 0.15)',
          marginBottom: '2.5rem',
        }}
      >
        {/* Ticket Header */}
        <div
          style={{
            background: 'linear-gradient(135deg, #e50914 0%, #990000 100%)',
            padding: '1.25rem 1.75rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.75rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Ticket size={22} color="#fff" />
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.15rem', color: '#fff' }}>
              IMOVIES ADMISSION PASS
            </span>
          </div>

          <div
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.35)',
              backdropFilter: 'blur(4px)',
              padding: '0.35rem 0.85rem',
              borderRadius: '8px',
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: '0.9rem',
              color: '#ffb703',
              letterSpacing: '0.08em',
            }}
          >
            REF: {booking.bookingId}
          </div>
        </div>

        {/* Ticket Body */}
        <div style={{ padding: '2rem 1.75rem' }}>
          <div style={{ display: 'flex', gap: '1.75rem', flexWrap: 'wrap' }}>
            {/* Poster thumbnail */}
            <img
              src={booking.movie?.poster}
              alt={booking.movie?.title}
              style={{
                width: '120px',
                aspectRatio: '2/3',
                objectFit: 'cover',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                backgroundColor: '#151b28',
              }}
            />

            {/* Movie & Theatre Info */}
            <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div>
                <h2
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.45rem',
                    fontWeight: 800,
                    color: '#fff',
                    marginBottom: '0.25rem',
                  }}
                >
                  {booking.movie?.title}
                </h2>
                <div style={{ color: '#ffb703', fontSize: '0.82rem', fontWeight: 600 }}>
                  {booking.movie?.language} • {booking.movie?.certificate || 'UA'} • {booking.movie?.runtime}m
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#cbd5e1', fontSize: '0.88rem' }}>
                <MapPin size={16} color="#e50914" />
                <span>{booking.theatre?.name} — {booking.show?.screenName}</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#cbd5e1', fontSize: '0.88rem' }}>
                <Calendar size={16} color="#e50914" />
                <span>{dateFormatted} at {timeFormatted}</span>
              </div>

              {/* Seats list */}
              <div style={{ marginTop: '0.25rem' }}>
                <span style={{ fontSize: '0.78rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>
                  Confirmed Seats ({booking.seats?.length}):
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.35rem' }}>
                  {booking.seats?.map((seat, i) => (
                    <span key={i} className="badge badge-amber" style={{ fontSize: '0.85rem', padding: '0.3rem 0.65rem' }}>
                      {seat.seatNumber} ({seat.seatType?.toUpperCase()})
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Dotted Perforation Line */}
          <div
            style={{
              position: 'relative',
              margin: '2rem -1.75rem',
              borderTop: '2px dashed rgba(255, 255, 255, 0.12)',
            }}
          />

          {/* Ticket Footer / Verification QR */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1.5rem',
            }}
          >
            <div>
              <div style={{ fontSize: '0.78rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>
                Customer & Payment
              </div>
              <div style={{ color: '#fff', fontWeight: 700, fontSize: '0.95rem', marginTop: '0.2rem' }}>
                {booking.user?.name || 'Verified Customer'}
              </div>
              <div style={{ color: '#64748b', fontSize: '0.78rem' }}>
                Demo Transaction ID: {booking.paymentId}
              </div>
              <div style={{ color: '#10b981', fontSize: '0.82rem', fontWeight: 600, marginTop: '0.25rem' }}>
                Total Paid: ${booking.totalAmount}
              </div>
            </div>

            {/* QR Code graphic */}
            <div
              style={{
                backgroundColor: '#ffffff',
                padding: '0.6rem',
                borderRadius: '10px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <QrCode size={78} color="#0b0e14" />
              <span style={{ fontSize: '0.62rem', color: '#0b0e14', fontWeight: 800, marginTop: '0.15rem' }}>
                {booking.bookingId}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1rem',
          flexWrap: 'wrap',
        }}
      >
        <button
          onClick={handlePrint}
          className="btn-secondary"
          style={{ padding: '0.75rem 1.4rem' }}
        >
          <Printer size={18} />
          <span>Print / Save Ticket</span>
        </button>

        <Link
          to="/my-bookings"
          className="btn-primary"
          style={{ padding: '0.75rem 1.5rem' }}
        >
          <span>View All My Bookings</span>
          <ArrowRight size={18} />
        </Link>
      </div>

      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #cinema-ticket-pass, #cinema-ticket-pass * {
            visibility: visible;
          }
          #cinema-ticket-pass {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            background-color: #fff !important;
            color: #000 !important;
          }
        }
      `}</style>
    </div>
  );
};

export default BookingConfirmationPage;

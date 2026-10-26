import React, { useState } from 'react';
import { Ticket, Calendar, MapPin, Tag, Check, ArrowRight } from 'lucide-react';

const BookingSummary = ({
  movie,
  theatre,
  show,
  selectedSeats = [],
  onProceed,
  loading = false,
}) => {
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponError, setCouponError] = useState('');

  // Calculations
  const subtotal = selectedSeats.reduce((sum, seat) => sum + (seat.price || 0), 0);
  const convenienceFee = selectedSeats.length > 0 ? Math.round(25 + selectedSeats.length * 15) : 0;

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    setCouponError('');
    const code = couponCode.trim().toUpperCase();

    if (code === 'IMOVIES50') {
      const discount = Math.min(Math.round(subtotal * 0.2), 100);
      setDiscountAmount(discount);
      setAppliedCoupon('IMOVIES50');
    } else if (code === 'WELCOME10') {
      const discount = Math.round(subtotal * 0.1);
      setDiscountAmount(discount);
      setAppliedCoupon('WELCOME10');
    } else {
      setCouponError('Invalid promo code. Try "IMOVIES50" or "WELCOME10"');
    }
  };

  const totalAmount = Math.max(0, subtotal + convenienceFee - discountAmount);

  // Format Show Date
  const showDate = show?.showTime ? new Date(show.showTime) : new Date();
  const dateFormatted = showDate.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
  const timeFormatted = showDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div
      className="glass-panel"
      style={{
        padding: '1.75rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
        borderRadius: '20px',
        position: 'sticky',
        top: '90px',
      }}
    >
      <h3
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: '1.25rem',
          fontWeight: 700,
          color: '#fff',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          paddingBottom: '0.85rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
        }}
      >
        <Ticket size={20} color="#e50914" />
        Booking Summary
      </h3>

      {/* Movie & Theatre Info */}
      <div style={{ display: 'flex', gap: '1rem' }}>
        <img
          src={movie?.poster}
          alt={movie?.title}
          style={{
            width: '68px',
            height: '96px',
            objectFit: 'cover',
            borderRadius: '8px',
            backgroundColor: '#151b28',
          }}
        />
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h4
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.05rem',
              fontWeight: 700,
              color: '#fff',
              lineHeight: 1.25,
              marginBottom: '0.35rem',
            }}
          >
            {movie?.title}
          </h4>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#94a3b8', fontSize: '0.82rem', marginBottom: '0.2rem' }}>
            <MapPin size={13} color="#e50914" />
            <span>{theatre?.name} ({show?.screenName})</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#ffb703', fontSize: '0.82rem', fontWeight: 600 }}>
            <Calendar size={13} />
            <span>{dateFormatted} • {timeFormatted}</span>
          </div>
        </div>
      </div>

      {/* Selected Seats Chips */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
          <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600 }}>
            Seats Selected ({selectedSeats.length})
          </span>
          {selectedSeats.length > 0 && (
            <span style={{ fontSize: '0.78rem', color: '#38bdf8', fontWeight: 600 }}>
              Max 8 seats
            </span>
          )}
        </div>

        {selectedSeats.length === 0 ? (
          <div
            style={{
              padding: '1.25rem',
              textAlign: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              borderRadius: '10px',
              border: '1px dashed rgba(255, 255, 255, 0.1)',
              color: '#64748b',
              fontSize: '0.88rem',
            }}
          >
            Please select your seats on the map
          </div>
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
            {selectedSeats.map((seat) => (
              <span
                key={seat.seatNumber}
                className="badge badge-amber"
                style={{ fontSize: '0.82rem', padding: '0.35rem 0.65rem' }}
              >
                {seat.seatNumber} (${seat.price})
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Promo Code Input */}
      {selectedSeats.length > 0 && (
        <form onSubmit={handleApplyCoupon} style={{ display: 'flex', gap: '0.5rem' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Tag size={15} color="#64748b" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              placeholder='Promo: "IMOVIES50"'
              className="form-input"
              style={{
                paddingLeft: '2.2rem',
                paddingTop: '0.5rem',
                paddingBottom: '0.5rem',
                fontSize: '0.85rem',
              }}
            />
          </div>
          <button
            type="submit"
            className="btn-secondary"
            style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
          >
            Apply
          </button>
        </form>
      )}

      {couponError && (
        <div style={{ color: '#ef4444', fontSize: '0.78rem', marginTop: '-0.75rem' }}>
          {couponError}
        </div>
      )}

      {appliedCoupon && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#10b981', fontSize: '0.82rem', marginTop: '-0.75rem' }}>
          <Check size={14} />
          <span>Promo applied! Saved ${discountAmount}</span>
        </div>
      )}

      {/* Pricing Breakdown */}
      <div
        style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          paddingTop: '1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.6rem',
          fontSize: '0.9rem',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#cbd5e1' }}>
          <span>Ticket Subtotal</span>
          <span>${subtotal}</span>
        </div>

        {selectedSeats.length > 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: '0.85rem' }}>
            <span>Convenience & Booking Fee</span>
            <span>${convenienceFee}</span>
          </div>
        )}

        {discountAmount > 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#10b981', fontSize: '0.85rem' }}>
            <span>Coupon Discount</span>
            <span>-${discountAmount}</span>
          </div>
        )}

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            paddingTop: '0.85rem',
            marginTop: '0.25rem',
            color: '#fff',
            fontWeight: 800,
            fontSize: '1.25rem',
          }}
        >
          <span>Total Amount</span>
          <span style={{ color: '#ffb703' }}>${totalAmount}</span>
        </div>
      </div>

      {/* Checkout CTA */}
      <button
        type="button"
        disabled={selectedSeats.length === 0 || loading}
        onClick={() => onProceed({ subtotal, convenienceFee, discount: discountAmount, totalAmount, couponCode: appliedCoupon })}
        className="btn-primary"
        style={{
          width: '100%',
          padding: '0.85rem',
          fontSize: '1rem',
        }}
      >
        <span>Proceed to Payment</span>
        <ArrowRight size={18} />
      </button>
    </div>
  );
};

export default BookingSummary;

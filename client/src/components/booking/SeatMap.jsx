import React from 'react';
import { Crown, Sparkles, UserCheck } from 'lucide-react';

const SeatMap = ({
  seatLayout = [],
  selectedSeats = [],
  onSeatToggle,
  pricing = { vip: 350, premium: 250, standard: 180 },
  maxSeats = 8,
}) => {
  // Group seats by Row (e.g. 'A', 'B', 'C', 'D', 'E', 'F')
  const rowsMap = new Map();
  seatLayout.forEach((seat) => {
    if (!rowsMap.has(seat.row)) {
      rowsMap.set(seat.row, []);
    }
    rowsMap.get(seat.row).push(seat);
  });

  const sortedRows = Array.from(rowsMap.keys()).sort();

  const getTierLabel = (row) => {
    if (row === 'A' || row === 'B') return { label: 'VIP RECLINERS', price: pricing.vip, color: '#8b5cf6', icon: Crown };
    if (row === 'C' || row === 'D') return { label: 'PREMIUM EXECUTIVE', price: pricing.premium, color: '#3b82f6', icon: Sparkles };
    return { label: 'STANDARD CLUB', price: pricing.standard, color: '#10b981', icon: UserCheck };
  };

  let lastTier = '';

  return (
    <div
      className="glass-panel"
      style={{
        padding: '2rem 1.5rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        overflowX: 'auto',
      }}
    >
      {/* Cinema Screen Graphic */}
      <div className="cinema-screen-container">
        <div className="cinema-screen-bar" />
        <div className="cinema-screen-label">CINEMA SCREEN (ALL EYES THIS WAY)</div>
      </div>

      {/* Seat Rows Matrix */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.85rem',
          minWidth: '520px',
          paddingBottom: '2rem',
        }}
      >
        {sortedRows.map((rowName) => {
          const tierInfo = getTierLabel(rowName);
          const isNewTier = tierInfo.label !== lastTier;
          lastTier = tierInfo.label;
          const TierIcon = tierInfo.icon;
          const rowSeats = rowsMap.get(rowName).sort((a, b) => a.number - b.number);

          return (
            <React.Fragment key={rowName}>
              {isNewTier && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    margin: '1rem 0 0.4rem 0',
                    paddingBottom: '0.3rem',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                  }}
                >
                  <TierIcon size={15} color={tierInfo.color} />
                  <span
                    style={{
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      color: tierInfo.color,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                    }}
                  >
                    {tierInfo.label} — ${tierInfo.price}
                  </span>
                </div>
              )}

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.75rem',
                }}
              >
                {/* Row Identifier Left */}
                <div
                  style={{
                    width: '24px',
                    textAlign: 'center',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    color: '#94a3b8',
                  }}
                >
                  {rowName}
                </div>

                {/* Seats in Row */}
                <div style={{ display: 'flex', gap: '0.45rem', alignItems: 'center' }}>
                  {rowSeats.map((seat, idx) => {
                    const isSelected = selectedSeats.some((s) => s.seatNumber === seat.seatNumber);
                    const isBooked = seat.status === 'booked';
                    const isLocked = seat.status === 'locked';

                    // Aisle spacer in middle
                    const isAisleSpacer = idx === 4;

                    return (
                      <React.Fragment key={seat.seatNumber}>
                        <button
                          type="button"
                          disabled={isBooked || isLocked}
                          onClick={() => onSeatToggle(seat)}
                          className={`seat-button ${
                            isSelected ? 'selected' : isBooked ? 'booked' : isLocked ? 'locked' : 'available'
                          }`}
                          title={`${seat.seatNumber} (${seat.seatType}) - $${seat.price}`}
                          style={{
                            ...(isSelected && {
                              boxShadow: '0 0 14px rgba(255, 183, 3, 0.6)',
                            }),
                          }}
                        >
                          {seat.number}
                        </button>
                        {isAisleSpacer && <div style={{ width: '18px' }} />}
                      </React.Fragment>
                    );
                  })}
                </div>

                {/* Row Identifier Right */}
                <div
                  style={{
                    width: '24px',
                    textAlign: 'center',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    color: '#94a3b8',
                  }}
                >
                  {rowName}
                </div>
              </div>
            </React.Fragment>
          );
        })}
      </div>

      {/* Seat Status Legend */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1.5rem',
          flexWrap: 'wrap',
          paddingTop: '1.5rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          width: '100%',
          fontSize: '0.82rem',
          color: '#cbd5e1',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
          <div className="seat-button available" style={{ width: '22px', height: '22px' }} />
          <span>Available</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
          <div className="seat-button selected" style={{ width: '22px', height: '22px' }} />
          <span>Selected</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
          <div className="seat-button booked" style={{ width: '22px', height: '22px' }} />
          <span>Booked / Reserved</span>
        </div>
      </div>
    </div>
  );
};

export default SeatMap;

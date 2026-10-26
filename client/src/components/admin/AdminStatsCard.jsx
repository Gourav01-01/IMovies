import React from 'react';

const AdminStatsCard = ({ title, value, icon: Icon, color = '#e50914', subtitle = '' }) => {
  return (
    <div
      className="glass-panel"
      style={{
        padding: '1.5rem',
        borderRadius: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div style={{ zIndex: 1 }}>
        <p style={{ color: '#94a3b8', fontSize: '0.82rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.35rem' }}>
          {title}
        </p>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 800, color: '#fff' }}>
          {value}
        </h3>
        {subtitle && (
          <p style={{ color: '#64748b', fontSize: '0.78rem', marginTop: '0.2rem' }}>
            {subtitle}
          </p>
        )}
      </div>

      <div
        style={{
          width: '52px',
          height: '52px',
          borderRadius: '14px',
          backgroundColor: `${color}18`,
          border: `1px solid ${color}35`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color,
          zIndex: 1,
        }}
      >
        <Icon size={24} />
      </div>

      {/* Subtle corner ambient glow */}
      <div
        style={{
          position: 'absolute',
          top: '-20px',
          right: '-20px',
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          backgroundColor: color,
          opacity: 0.12,
          filter: 'blur(25px)',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
};

export default AdminStatsCard;

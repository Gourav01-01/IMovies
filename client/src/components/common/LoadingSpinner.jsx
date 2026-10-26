import React from 'react';
import { Film } from 'lucide-react';

const LoadingSpinner = ({ text = 'Loading cinema experience...', fullScreen = false }) => {
  const content = (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1rem',
        padding: '2.5rem',
      }}
    >
      <div style={{ position: 'relative', width: '56px', height: '56px' }}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            border: '3px solid rgba(229, 9, 20, 0.2)',
            borderTopColor: '#e50914',
            animation: 'spin 0.9s linear infinite',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: '6px',
            borderRadius: '50%',
            border: '2px solid rgba(255, 183, 3, 0.2)',
            borderBottomColor: '#ffb703',
            animation: 'spin 1.4s linear infinite reverse',
          }}
        />
        <Film
          size={22}
          color="#e50914"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        />
      </div>
      <p style={{ color: '#94a3b8', fontSize: '0.92rem', fontWeight: 500 }}>
        {text}
      </p>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );

  if (fullScreen) {
    return (
      <div
        style={{
          minHeight: '60vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {content}
      </div>
    );
  }

  return content;
};

export default LoadingSpinner;

import React from 'react';
import { Link } from 'react-router-dom';
import { Film, Home } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div
      className="container"
      style={{
        minHeight: '60vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '3rem 1.5rem',
      }}
    >
      <Film size={54} color="#e50914" style={{ marginBottom: '1rem' }} />
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '3rem', fontWeight: 800, color: '#fff', marginBottom: '0.5rem' }}>
        404
      </h1>
      <h2 style={{ fontSize: '1.4rem', color: '#cbd5e1', marginBottom: '1rem' }}>
        Scene Not Found
      </h2>
      <p style={{ color: '#94a3b8', maxWidth: '420px', marginBottom: '2rem' }}>
        The cinema feature or page you're searching for seems to have left the screening room.
      </p>
      <Link to="/" className="btn-primary">
        <Home size={18} />
        <span>Return to Premiere Home</span>
      </Link>
    </div>
  );
};

export default NotFoundPage;

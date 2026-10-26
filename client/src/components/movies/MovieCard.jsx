import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, Ticket } from 'lucide-react';

const MovieCard = ({ movie }) => {
  const isComingSoon = movie.status === 'coming_soon';

  return (
    <div
      className="glass-panel"
      style={{
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '16px',
        overflow: 'hidden',
        transition: 'all 250ms ease',
        height: '100%',
        position: 'relative',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-6px)';
        e.currentTarget.style.borderColor = 'rgba(229, 9, 20, 0.4)';
        e.currentTarget.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.8), 0 0 20px rgba(229, 9, 20, 0.2)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
        e.currentTarget.style.boxShadow = '0 10px 30px -10px rgba(0, 0, 0, 0.6)';
      }}
    >
      {/* Poster Image Container */}
      <Link
        to={`/movies/${movie._id}`}
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '2/3',
          overflow: 'hidden',
          backgroundColor: '#121721',
          display: 'block',
        }}
      >
        <img
          src={movie.poster}
          alt={movie.title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 350ms ease',
          }}
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=800&q=80';
          }}
        />

        {/* Top Badges */}
        <div
          style={{
            position: 'absolute',
            top: '0.75rem',
            left: '0.75rem',
            right: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            pointerEvents: 'none',
          }}
        >
          <div
            style={{
              backgroundColor: 'rgba(11, 14, 20, 0.85)',
              backdropFilter: 'blur(8px)',
              padding: '0.2rem 0.55rem',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
              fontSize: '0.82rem',
              fontWeight: 700,
              color: '#ffb703',
              border: '1px solid rgba(255, 183, 3, 0.3)',
            }}
          >
            <Star size={12} fill="#ffb703" color="#ffb703" />
            <span>{movie.rating ? movie.rating.toFixed(1) : '8.0'}</span>
          </div>

          <span
            className={`badge ${isComingSoon ? 'badge-amber' : 'badge-crimson'}`}
            style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem' }}
          >
            {isComingSoon ? 'Coming Soon' : movie.certificate || 'UA'}
          </span>
        </div>

        {/* Bottom Format Overlay */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: '1.5rem 0.75rem 0.5rem 0.75rem',
            background: 'linear-gradient(to top, rgba(7, 9, 14, 0.95) 0%, transparent 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.78rem',
            color: '#cbd5e1',
          }}
        >
          <span>{movie.language}</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <Clock size={12} />
            {movie.runtime}m
          </span>
        </div>
      </Link>

      {/* Card Info Details */}
      <div
        style={{
          padding: '1rem',
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          justifyContent: 'space-between',
        }}
      >
        <div>
          <Link to={`/movies/${movie._id}`}>
            <h3
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.05rem',
                fontWeight: 700,
                color: '#fff',
                marginBottom: '0.35rem',
                lineHeight: 1.3,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
              title={movie.title}
            >
              {movie.title}
            </h3>
          </Link>

          <p
            style={{
              fontSize: '0.8rem',
              color: '#94a3b8',
              marginBottom: '0.85rem',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {Array.isArray(movie.genre) ? movie.genre.join(' • ') : movie.genre}
          </p>
        </div>

        <Link
          to={`/movies/${movie._id}`}
          className={isComingSoon ? 'btn-secondary' : 'btn-primary'}
          style={{
            width: '100%',
            padding: '0.55rem',
            fontSize: '0.88rem',
            textAlign: 'center',
          }}
        >
          <Ticket size={16} />
          {isComingSoon ? 'View Details' : 'Book Tickets'}
        </Link>
      </div>
    </div>
  );
};

export default MovieCard;

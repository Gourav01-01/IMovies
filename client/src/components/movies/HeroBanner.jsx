import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Ticket, Star, Clock, Calendar } from 'lucide-react';

const HeroBanner = ({ movie }) => {
  if (!movie) return null;

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '480px',
        borderRadius: '24px',
        overflow: 'hidden',
        marginBottom: '3rem',
        backgroundImage: `linear-gradient(to right, rgba(7, 9, 14, 0.95) 25%, rgba(7, 9, 14, 0.75) 60%, rgba(7, 9, 14, 0.4) 100%), url(${movie.backdrop || movie.poster})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center top',
        display: 'flex',
        alignItems: 'center',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8), inset 0 0 100px rgba(0,0,0,0.6)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
      }}
    >
      <div
        className="container"
        style={{
          padding: '3rem 2.5rem',
          maxWidth: '780px',
        }}
      >
        {/* Top Badges */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
          <span className="badge badge-crimson">Featured Spotlight</span>
          <span className="badge badge-amber" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <Star size={13} fill="#ffb703" color="#ffb703" />
            {movie.rating?.toFixed(1) || '8.5'} Rating
          </span>
          <span className="badge badge-purple">{movie.certificate || 'UA'}</span>
          <span className="badge badge-blue">{movie.language}</span>
        </div>

        {/* Title */}
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2rem, 4vw, 3.2rem)',
            fontWeight: 800,
            lineHeight: 1.15,
            color: '#ffffff',
            letterSpacing: '-0.02em',
            marginBottom: '1rem',
            textShadow: '0 4px 20px rgba(0,0,0,0.7)',
          }}
        >
          {movie.title}
        </h1>

        {/* Meta details */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.25rem',
            color: '#cbd5e1',
            fontSize: '0.9rem',
            fontWeight: 500,
            marginBottom: '1.25rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Clock size={16} color="#e50914" />
            <span>{Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m</span>
          </div>
          <div>•</div>
          <div>{Array.isArray(movie.genre) ? movie.genre.join(', ') : movie.genre}</div>
        </div>

        {/* Description */}
        <p
          style={{
            color: '#94a3b8',
            fontSize: '0.98rem',
            lineHeight: 1.65,
            marginBottom: '2rem',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {movie.description}
        </p>

        {/* CTA Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <Link to={`/movies/${movie._id}`} className="btn-primary" style={{ padding: '0.8rem 1.8rem', fontSize: '1rem' }}>
            <Ticket size={20} />
            Book Tickets Now
          </Link>

          {movie.trailerUrl && (
            <a
              href={movie.trailerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
              style={{ padding: '0.8rem 1.5rem', fontSize: '0.95rem' }}
            >
              <Play size={18} fill="#fff" />
              Watch Trailer
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;

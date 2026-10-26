import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Star,
  Clock,
  Calendar,
  Play,
  MapPin,
  Film,
  Ticket,
  Sparkles,
  Users,
  Award,
  ChevronRight,
} from 'lucide-react';
import { movieApi } from '../api/movieApi';
import LoadingSpinner from '../components/common/LoadingSpinner';

const MovieDetailPage = ({ selectedCity = 'All' }) => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [groupedShows, setGroupedShows] = useState([]);
  const [totalShows, setTotalShows] = useState(0);
  const [selectedDateIndex, setSelectedDateIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Generate next 4 dates (Today, Tomorrow, +2, +3)
  const availableDates = Array.from({ length: 4 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d;
  });

  const selectedDate = availableDates[selectedDateIndex];

  useEffect(() => {
    const fetchMovieData = async () => {
      try {
        setLoading(true);
        const dateStr = selectedDate.toISOString().split('T')[0];
        const res = await movieApi.getMovieById(id, {
          city: selectedCity,
          date: dateStr,
        });
        setMovie(res.movie);
        setGroupedShows(res.groupedShows || []);
        setTotalShows(res.totalShows || 0);
      } catch (err) {
        setError('Movie not found or failed to load.');
      } finally {
        setLoading(false);
      }
    };
    fetchMovieData();
  }, [id, selectedDateIndex, selectedCity]);

  if (loading) {
    return <LoadingSpinner fullScreen text="Loading movie details & showtimes..." />;
  }

  if (error || !movie) {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
        <h2 style={{ color: '#ef4444', marginBottom: '1rem' }}>{error || 'Movie not found'}</h2>
        <Link to="/movies" className="btn-primary">
          Back to Movies
        </Link>
      </div>
    );
  }

  return (
    <div style={{ paddingBottom: '5rem' }}>
      {/* Hero Backdrop Banner */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          minHeight: '440px',
          backgroundImage: `linear-gradient(to bottom, rgba(7, 9, 14, 0.4) 0%, rgba(7, 9, 14, 0.95) 90%, #07090e 100%), linear-gradient(to right, rgba(7, 9, 14, 0.95) 15%, transparent 60%), url(${movie.backdrop || movie.poster})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 20%',
          display: 'flex',
          alignItems: 'flex-end',
          paddingBottom: '2.5rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        <div className="container" style={{ display: 'flex', gap: '2.5rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
          {/* Floating Poster */}
          <div
            style={{
              width: '220px',
              aspectRatio: '2/3',
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.9), 0 0 30px rgba(229, 9, 20, 0.3)',
              border: '2px solid rgba(255, 255, 255, 0.15)',
              flexShrink: 0,
              backgroundColor: '#111622',
            }}
          >
            <img
              src={movie.poster}
              alt={movie.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          {/* Details header */}
          <div style={{ flex: '1 1 400px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
              <span className="badge badge-crimson">{movie.certificate || 'UA'}</span>
              <span className="badge badge-amber" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Star size={13} fill="#ffb703" color="#ffb703" />
                {movie.rating ? movie.rating.toFixed(1) : '8.5'}/10
              </span>
              <span className="badge badge-purple">{movie.language}</span>
              <span className="badge badge-blue">{Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m</span>
            </div>

            <h1
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2rem, 3.5vw, 2.8rem)',
                fontWeight: 800,
                color: '#fff',
                lineHeight: 1.2,
                marginBottom: '0.75rem',
              }}
            >
              {movie.title}
            </h1>

            <p style={{ color: '#cbd5e1', fontSize: '0.92rem', marginBottom: '1.25rem' }}>
              {Array.isArray(movie.genre) ? movie.genre.join(' • ') : movie.genre}
            </p>

            {movie.trailerUrl && (
              <a
                href={movie.trailerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary"
                style={{ padding: '0.55rem 1.2rem', fontSize: '0.9rem' }}
              >
                <Play size={16} fill="#fff" />
                Watch Official Trailer
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Main Content: Synopsis, Cast, and Showtime Selection */}
      <div className="container" style={{ marginTop: '2.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem' }}>
          {/* Left Column: Synopsis & Details */}
          <div>
            <h2 className="section-title" style={{ marginBottom: '1rem' }}>
              About the Movie
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '2rem' }}>
              {movie.description}
            </p>

            {/* Director & Cast */}
            <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {movie.director && (
                <div>
                  <div style={{ color: '#64748b', fontSize: '0.78rem', textTransform: 'uppercase', fontWeight: 700 }}>
                    Director
                  </div>
                  <div style={{ color: '#fff', fontWeight: 600, fontSize: '0.95rem', marginTop: '0.2rem' }}>
                    {movie.director}
                  </div>
                </div>
              )}

              {movie.cast && movie.cast.length > 0 && (
                <div>
                  <div style={{ color: '#64748b', fontSize: '0.78rem', textTransform: 'uppercase', fontWeight: 700 }}>
                    Starring Cast
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.4rem' }}>
                    {movie.cast.map((actor, idx) => (
                      <span key={idx} className="badge badge-blue" style={{ fontSize: '0.8rem' }}>
                        {actor}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Showtime Schedule & Cinema Locations */}
          <div style={{ flex: '1 1 500px' }}>
            <h2 className="section-title" style={{ marginBottom: '1.25rem' }}>
              Select Showtime
            </h2>

            {/* Date Selection Pills */}
            <div
              style={{
                display: 'flex',
                gap: '0.75rem',
                overflowX: 'auto',
                paddingBottom: '0.5rem',
                marginBottom: '2rem',
              }}
            >
              {availableDates.map((dateObj, idx) => {
                const isSelected = selectedDateIndex === idx;
                const dayName = idx === 0 ? 'Today' : idx === 1 ? 'Tomorrow' : dateObj.toLocaleDateString('en-US', { weekday: 'short' });
                const monthDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedDateIndex(idx)}
                    style={{
                      padding: '0.7rem 1.25rem',
                      borderRadius: '12px',
                      backgroundColor: isSelected ? '#e50914' : 'rgba(255, 255, 255, 0.05)',
                      border: isSelected ? '1px solid #e50914' : '1px solid rgba(255, 255, 255, 0.1)',
                      color: '#fff',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '0.2rem',
                      minWidth: '100px',
                      boxShadow: isSelected ? '0 4px 18px rgba(229, 9, 20, 0.4)' : 'none',
                      transition: 'all 150ms',
                    }}
                  >
                    <span style={{ fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase' }}>
                      {dayName}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: isSelected ? '#ffe4e6' : '#94a3b8' }}>
                      {monthDate}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Theatres and Shows List */}
            {groupedShows.length === 0 ? (
              <div
                className="glass-panel"
                style={{ padding: '3rem 2rem', textAlign: 'center', color: '#94a3b8' }}
              >
                <Calendar size={36} color="#64748b" style={{ marginBottom: '0.75rem' }} />
                <h3 style={{ color: '#fff', marginBottom: '0.35rem' }}>No shows available for this date</h3>
                <p style={{ fontSize: '0.88rem' }}>
                  Try choosing another date above or change your location filter.
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {groupedShows.map((group) => {
                  const t = group.theatre;
                  return (
                    <div
                      key={t._id}
                      className="glass-panel"
                      style={{ padding: '1.5rem', borderRadius: '16px' }}
                    >
                      {/* Theatre Header */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          justifyContent: 'space-between',
                          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                          paddingBottom: '0.85rem',
                          marginBottom: '1.25rem',
                        }}
                      >
                        <div>
                          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', color: '#fff', fontWeight: 700 }}>
                            {t.name}
                          </h3>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#94a3b8', fontSize: '0.82rem', marginTop: '0.2rem' }}>
                            <MapPin size={13} color="#e50914" />
                            <span>{t.location?.address}, {t.location?.city}</span>
                          </div>
                        </div>

                        {/* Amenities */}
                        {t.amenities && t.amenities.length > 0 && (
                          <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                            {t.amenities.slice(0, 2).map((a, i) => (
                              <span key={i} className="badge badge-amber" style={{ fontSize: '0.68rem' }}>
                                {a}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Showtimes Grid */}
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.85rem' }}>
                        {group.shows.map((showItem) => {
                          const showTime = new Date(showItem.showTime);
                          const timeStr = showTime.toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit',
                          });

                          return (
                            <Link
                              key={showItem._id}
                              to={`/booking/${showItem._id}`}
                              style={{
                                padding: '0.65rem 1rem',
                                borderRadius: '10px',
                                backgroundColor: 'rgba(255, 255, 255, 0.06)',
                                border: '1px solid rgba(255, 255, 255, 0.12)',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '0.25rem',
                                minWidth: '110px',
                                transition: 'all 180ms ease',
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = 'rgba(229, 9, 20, 0.18)';
                                e.currentTarget.style.borderColor = '#e50914';
                                e.currentTarget.style.transform = 'translateY(-2px)';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.06)';
                                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
                                e.currentTarget.style.transform = 'translateY(0)';
                              }}
                            >
                              <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#fff' }}>
                                {timeStr}
                              </span>
                              <span style={{ fontSize: '0.72rem', color: '#ffb703', fontWeight: 600 }}>
                                {showItem.screenName?.split(' - ')[0] || 'Audi 1'}
                              </span>
                              <span style={{ fontSize: '0.68rem', color: '#34d399' }}>
                                {showItem.availableSeatsCount} seats left
                              </span>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetailPage;

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Film, Sparkles, Compass, ArrowRight, ShieldCheck, Video, Volume2, Armchair } from 'lucide-react';
import { movieApi } from '../api/movieApi';
import HeroBanner from '../components/movies/HeroBanner';
import MovieCard from '../components/movies/MovieCard';
import LoadingSpinner from '../components/common/LoadingSpinner';

const HomePage = ({ selectedCity = 'All' }) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const res = await movieApi.getMovies({ city: selectedCity, limit: 12 });
        setMovies(res.movies || []);
      } catch (err) {
        setError('Failed to load cinema schedule. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, [selectedCity]);

  if (loading) {
    return <LoadingSpinner fullScreen text="Loading spotlight releases & showtimes..." />;
  }

  const spotlightMovie = movies.find((m) => m.status === 'now_showing') || movies[0];
  const nowShowing = movies.filter((m) => m.status === 'now_showing');
  const comingSoon = movies.filter((m) => m.status === 'coming_soon');

  return (
    <div className="container" style={{ paddingBottom: '4rem' }}>
      {/* Hero Banner for Spotlight Movie */}
      {spotlightMovie && <HeroBanner movie={spotlightMovie} />}

      {/* Now Showing Section */}
      <section style={{ marginBottom: '4rem' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1.75rem',
          }}
        >
          <div>
            <h2 className="section-title">Now Showing</h2>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '0.25rem' }}>
              Experience the latest cinematic releases on the big screen
              {selectedCity !== 'All' && ` in ${selectedCity}`}
            </p>
          </div>
          <Link
            to="/movies?status=now_showing"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              color: '#ffb703',
              fontSize: '0.92rem',
              fontWeight: 600,
            }}
          >
            <span>View All</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        {nowShowing.length === 0 ? (
          <div
            className="glass-panel"
            style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}
          >
            No shows currently scheduled for this location. Check back soon or select "All Locations".
          </div>
        ) : (
          <div className="movie-grid">
            {nowShowing.map((movie) => (
              <MovieCard key={movie._id} movie={movie} />
            ))}
          </div>
        )}
      </section>

      {/* Cinema Premium Formats Showcase */}
      <section style={{ marginBottom: '4rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <span className="badge badge-amber" style={{ marginBottom: '0.6rem' }}>
            Elevated Entertainment
          </span>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '2rem',
              fontWeight: 800,
              color: '#fff',
            }}
          >
            The Ultimate Cinema Experience
          </h2>
          <p style={{ color: '#94a3b8', maxWidth: '600px', margin: '0.5rem auto 0 auto' }}>
            Immerse yourself in breathtaking visuals and earth-shattering acoustics with our world-class cinema technology.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem',
          }}
        >
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                backgroundColor: 'rgba(229, 9, 20, 0.15)',
                color: '#e50914',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem',
              }}
            >
              <Video size={24} />
            </div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: '#fff', marginBottom: '0.5rem' }}>
              IMAX® with Laser 4K
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '0.88rem', lineHeight: 1.6 }}>
              Next-generation 4K dual laser projection delivers unprecedented brightness, crystal-clear resolution, and deeper contrast.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '2rem' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                backgroundColor: 'rgba(59, 130, 246, 0.15)',
                color: '#3b82f6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem',
              }}
            >
              <Volume2 size={24} />
            </div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: '#fff', marginBottom: '0.5rem' }}>
              Dolby Atmos® Spatial Sound
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '0.88rem', lineHeight: 1.6 }}>
              Sound that flows all around you—even overhead—with astounding clarity and depth to put you right in the center of the story.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '2rem' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                backgroundColor: 'rgba(255, 183, 3, 0.15)',
                color: '#ffb703',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem',
              }}
            >
              <Armchair size={24} />
            </div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: '#fff', marginBottom: '0.5rem' }}>
              VIP Luxury Recliners
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '0.88rem', lineHeight: 1.6 }}>
              Plush motorized leather loungers, personal swivel tables, and in-theatre food service crafted for royal comfort.
            </p>
          </div>
        </div>
      </section>

      {/* Coming Soon Section */}
      {comingSoon.length > 0 && (
        <section>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1.75rem',
            }}
          >
            <div>
              <h2 className="section-title">Coming Soon</h2>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '0.25rem' }}>
                Anticipated blockbusters arriving soon to IMovies screens
              </p>
            </div>
            <Link
              to="/movies?status=coming_soon"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                color: '#ffb703',
                fontSize: '0.92rem',
                fontWeight: 600,
              }}
            >
              <span>Explore All</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="movie-grid">
            {comingSoon.map((movie) => (
              <MovieCard key={movie._id} movie={movie} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default HomePage;

import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Film,
  Search,
  MapPin,
  Ticket,
  User,
  LogOut,
  ShieldAlert,
  Menu,
  X,
  ChevronDown,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Navbar = ({ selectedCity = 'All', onCityChange }) => {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const cities = ['All', 'New York', 'Los Angeles', 'Chicago'];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/movies?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    navigate('/');
  };

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backgroundColor: 'rgba(7, 9, 14, 0.85)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '74px',
          gap: '1.25rem',
        }}
      >
        {/* Brand Logo */}
        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            textDecoration: 'none',
          }}
        >
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #e50914 0%, #ffb703 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 16px rgba(229, 9, 20, 0.5)',
            }}
          >
            <Film size={22} color="#ffffff" strokeWidth={2.4} />
          </div>
          <div>
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.45rem',
                fontWeight: 800,
                letterSpacing: '-0.03em',
                background: 'linear-gradient(135deg, #ffffff 40%, #ffb703 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              IMOVIES
            </span>
            <span
              style={{
                display: 'block',
                fontSize: '0.62rem',
                color: '#94a3b8',
                fontWeight: 600,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                marginTop: '-3px',
              }}
            >
              Cinema Experience
            </span>
          </div>
        </Link>

        {/* Search Bar - Desktop */}
        <form
          onSubmit={handleSearchSubmit}
          style={{
            display: 'none',
            flex: 1,
            maxWidth: '380px',
            position: 'relative',
          }}
          className="desktop-search"
        >
          <Search
            size={18}
            color="#64748b"
            style={{
              position: 'absolute',
              left: '1rem',
              top: '50%',
              transform: 'translateY(-50%)',
            }}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search movies, genres, actors..."
            style={{
              width: '100%',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '9999px',
              padding: '0.55rem 1rem 0.55rem 2.6rem',
              color: '#fff',
              fontSize: '0.9rem',
              outline: 'none',
              transition: 'all 200ms',
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = '#e50914';
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
            }}
          />
        </form>

        {/* Navigation Links - Desktop */}
        <nav
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.25rem',
          }}
          className="desktop-nav"
        >
          {/* City Selector */}
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <MapPin size={16} color="#e50914" style={{ marginRight: '0.35rem' }} />
            <select
              value={selectedCity}
              onChange={(e) => onCityChange && onCityChange(e.target.value)}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: '#f8fafc',
                fontSize: '0.85rem',
                fontWeight: 600,
                padding: '0.4rem 0.75rem',
                borderRadius: '8px',
                cursor: 'pointer',
                outline: 'none',
              }}
            >
              {cities.map((city) => (
                <option key={city} value={city} style={{ background: '#0e121a', color: '#fff' }}>
                  {city === 'All' ? 'All Locations' : city}
                </option>
              ))}
            </select>
          </div>

          <Link
            to="/movies"
            style={{
              fontSize: '0.92rem',
              fontWeight: location.pathname === '/movies' ? 700 : 500,
              color: location.pathname === '/movies' ? '#ffb703' : '#cbd5e1',
            }}
          >
            Movies
          </Link>

          {user && (
            <Link
              to="/my-bookings"
              style={{
                fontSize: '0.92rem',
                fontWeight: location.pathname === '/my-bookings' ? 700 : 500,
                color: location.pathname === '/my-bookings' ? '#ffb703' : '#cbd5e1',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
              }}
            >
              <Ticket size={16} color="#e50914" />
              My Tickets
            </Link>
          )}

          {isAdmin && (
            <Link
              to="/admin"
              className="badge badge-crimson"
              style={{
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
                padding: '0.35rem 0.75rem',
              }}
            >
              <ShieldAlert size={14} />
              Admin Portal
            </Link>
          )}
        </nav>

        {/* User Account Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {user ? (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.45rem 0.85rem',
                  borderRadius: '9999px',
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  color: '#fff',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                }}
              >
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    backgroundColor: '#e50914',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                  }}
                >
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <span>{user.name?.split(' ')[0]}</span>
                <ChevronDown size={14} color="#94a3b8" />
              </button>

              {userDropdownOpen && (
                <div
                  className="glass-panel fade-in"
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: '115%',
                    width: '220px',
                    backgroundColor: '#0f1422',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '12px',
                    padding: '0.5rem',
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.7)',
                    zIndex: 60,
                  }}
                >
                  <div
                    style={{
                      padding: '0.6rem 0.8rem',
                      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                      marginBottom: '0.4rem',
                    }}
                  >
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#fff' }}>
                      {user.name}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                      {user.email}
                    </div>
                    <span
                      className={`badge ${isAdmin ? 'badge-crimson' : 'badge-amber'}`}
                      style={{ marginTop: '0.35rem' }}
                    >
                      {isAdmin ? 'Administrator' : 'Cinema Member'}
                    </span>
                  </div>

                  <Link
                    to="/my-bookings"
                    onClick={() => setUserDropdownOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.55rem 0.8rem',
                      fontSize: '0.88rem',
                      color: '#cbd5e1',
                      borderRadius: '8px',
                      transition: 'background 150ms',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <Ticket size={16} color="#e50914" />
                    My Bookings
                  </Link>

                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setUserDropdownOpen(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.55rem 0.8rem',
                        fontSize: '0.88rem',
                        color: '#ff4d58',
                        borderRadius: '8px',
                        transition: 'background 150ms',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(229,9,20,0.15)')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <ShieldAlert size={16} />
                      Admin Control Panel
                    </Link>
                  )}

                  <button
                    onClick={handleLogout}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.55rem 0.8rem',
                      fontSize: '0.88rem',
                      color: '#ef4444',
                      borderRadius: '8px',
                      transition: 'background 150ms',
                      textAlign: 'left',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(239,68,68,0.12)')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <LogOut size={16} />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Link
                to="/login"
                className="btn-secondary"
                style={{
                  padding: '0.45rem 1rem',
                  fontSize: '0.88rem',
                }}
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="btn-primary"
                style={{
                  padding: '0.45rem 1.1rem',
                  fontSize: '0.88rem',
                }}
              >
                Register
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: 'none',
              padding: '0.4rem',
              color: '#fff',
            }}
            className="mobile-toggle"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          style={{
            backgroundColor: '#0a0d14',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '1rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          <form onSubmit={handleSearchSubmit}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search movies..."
              style={{
                width: '100%',
                backgroundColor: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '8px',
                padding: '0.6rem 1rem',
                color: '#fff',
              }}
            />
          </form>
          <Link
            to="/movies"
            onClick={() => setMobileMenuOpen(false)}
            style={{ color: '#fff', fontWeight: 600 }}
          >
            Explore Movies
          </Link>
          {user && (
            <Link
              to="/my-bookings"
              onClick={() => setMobileMenuOpen(false)}
              style={{ color: '#fff', fontWeight: 600 }}
            >
              My Bookings
            </Link>
          )}
          {isAdmin && (
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              style={{ color: '#ff4d58', fontWeight: 600 }}
            >
              Admin Dashboard
            </Link>
          )}
        </div>
      )}

      <style>{`
        @media (min-width: 768px) {
          .desktop-search { display: block !important; }
        }
        @media (max-width: 767px) {
          .desktop-nav { display: none !important; }
          .mobile-toggle { display: block !important; }
        }
      `}</style>
    </header>
  );
};

export default Navbar;

import React from 'react';
import { Film, ShieldCheck, Heart, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer
      style={{
        backgroundColor: '#05070a',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        marginTop: 'auto',
        padding: '3.5rem 0 2rem 0',
      }}
    >
      <div className="container">
        {/* Top Info Banner */}
        <div
          style={{
            backgroundColor: 'rgba(255, 183, 3, 0.06)',
            border: '1px solid rgba(255, 183, 3, 0.2)',
            borderRadius: '12px',
            padding: '1rem 1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            marginBottom: '3rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Sparkles size={20} color="#ffb703" />
            <div>
              <strong style={{ color: '#ffb703', fontSize: '0.95rem' }}>
                DEMO ENVIRONMENT NOTICE
              </strong>
              <p style={{ color: '#94a3b8', fontSize: '0.82rem', margin: 0 }}>
                This is a fully featured demonstration cinema ticket booking application. No real credit card charges are made.
              </p>
            </div>
          </div>
          <div className="badge badge-amber" style={{ fontSize: '0.75rem' }}>
            Interactive Demo Mode
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '2.5rem',
            marginBottom: '2.5rem',
          }}
        >
          {/* Brand Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #e50914, #ffb703)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Film size={18} color="#fff" />
              </div>
              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 800,
                  fontSize: '1.25rem',
                  color: '#fff',
                }}
              >
                IMOVIES
              </span>
            </div>
            <p style={{ color: '#94a3b8', fontSize: '0.88rem', lineHeight: '1.6' }}>
              The ultimate next-generation cinematic ticket booking destination. Real-time seat selection, high-fidelity sound formats, and instant confirmations.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ color: '#fff', fontSize: '0.95rem', fontWeight: 700, marginBottom: '1rem' }}>
              Explore
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <li>
                <Link to="/movies?status=now_showing" style={{ color: '#94a3b8', fontSize: '0.88rem' }}>
                  Now Showing
                </Link>
              </li>
              <li>
                <Link to="/movies?status=coming_soon" style={{ color: '#94a3b8', fontSize: '0.88rem' }}>
                  Coming Soon
                </Link>
              </li>
              <li>
                <Link to="/my-bookings" style={{ color: '#94a3b8', fontSize: '0.88rem' }}>
                  My Tickets & Pass
                </Link>
              </li>
            </ul>
          </div>

          {/* Formats & Experience */}
          <div>
            <h4 style={{ color: '#fff', fontSize: '0.95rem', fontWeight: 700, marginBottom: '1rem' }}>
              Formats & Tech
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <li style={{ color: '#94a3b8', fontSize: '0.88rem' }}>IMAX with 4K Laser</li>
              <li style={{ color: '#94a3b8', fontSize: '0.88rem' }}>Dolby Cinema & Atmos</li>
              <li style={{ color: '#94a3b8', fontSize: '0.88rem' }}>VIP Recliner Lounges</li>
              <li style={{ color: '#94a3b8', fontSize: '0.88rem' }}>Real-time Socket.IO Sync</li>
            </ul>
          </div>

          {/* Admin & Security */}
          <div>
            <h4 style={{ color: '#fff', fontSize: '0.95rem', fontWeight: 700, marginBottom: '1rem' }}>
              Management
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <li>
                <Link to="/admin" style={{ color: '#ff4d58', fontSize: '0.88rem', fontWeight: 600 }}>
                  Admin Control Panel
                </Link>
              </li>
              <li>
                <Link to="/login" style={{ color: '#94a3b8', fontSize: '0.88rem' }}>
                  Account Sign In
                </Link>
              </li>
              <li>
                <Link to="/register" style={{ color: '#94a3b8', fontSize: '0.88rem' }}>
                  Join Membership
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Line */}
        <div
          style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.06)',
            paddingTop: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            color: '#64748b',
            fontSize: '0.82rem',
          }}
        >
          <div>
            © {new Date().getFullYear()} IMovies Cinema Systems. Built with MERN Stack.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span>Crafted with</span>
            <Heart size={14} color="#e50914" fill="#e50914" />
            <span>for cinema lovers</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Film,
  Building,
  Calendar,
  Ticket,
  ArrowLeft,
  ShieldCheck,
} from 'lucide-react';

const AdminSidebar = () => {
  const navItems = [
    { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { to: '/admin/movies', label: 'Movies', icon: Film },
    { to: '/admin/theatres', label: 'Theatres', icon: Building },
    { to: '/admin/shows', label: 'Showtimes', icon: Calendar },
    { to: '/admin/bookings', label: 'All Bookings', icon: Ticket },
  ];

  return (
    <aside
      className="glass-panel"
      style={{
        width: '260px',
        minHeight: 'calc(100vh - 120px)',
        padding: '1.5rem 1rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        borderRadius: '16px',
        backgroundColor: '#0c1018',
      }}
    >
      <div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            padding: '0.5rem 0.75rem',
            marginBottom: '1.5rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            paddingBottom: '1rem',
          }}
        >
          <div
            style={{
              padding: '0.4rem',
              borderRadius: '8px',
              backgroundColor: 'rgba(229, 9, 20, 0.15)',
              color: '#e50914',
            }}
          >
            <ShieldCheck size={20} />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#fff' }}>
              ADMIN PORTAL
            </div>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
              Cinema Operations Hub
            </div>
          </div>
        </div>

        {/* Navigation list */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.7rem 1rem',
                  borderRadius: '10px',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  color: isActive ? '#ffffff' : '#94a3b8',
                  backgroundColor: isActive ? '#e50914' : 'transparent',
                  boxShadow: isActive ? '0 4px 14px rgba(229, 9, 20, 0.35)' : 'none',
                  transition: 'all 150ms',
                })}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Return to Cinema Client */}
      <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '1rem' }}>
        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.6rem 0.8rem',
            color: '#94a3b8',
            fontSize: '0.85rem',
            fontWeight: 500,
            borderRadius: '8px',
            transition: 'color 150ms',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}
        >
          <ArrowLeft size={16} />
          <span>Exit to Main Site</span>
        </Link>
      </div>
    </aside>
  );
};

export default AdminSidebar;

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '../../api/adminApi';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminStatsCard from '../../components/admin/AdminStatsCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import {
  DollarSign,
  Ticket,
  Film,
  Calendar,
  Building,
  PlusCircle,
  TrendingUp,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';

const AdminDashboardPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await adminApi.getStats();
        setData(res);
      } catch (err) {
        console.error('Error fetching admin stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return <LoadingSpinner fullScreen text="Loading administrative metrics..." />;
  }

  const stats = data?.stats || {
    totalRevenue: 0,
    totalTicketsSold: 0,
    totalMovies: 0,
    totalShows: 0,
    totalTheatres: 0,
  };

  const recentBookings = data?.recentBookings || [];
  const topMovies = data?.topMovies || [];

  return (
    <div className="container" style={{ padding: '2rem 1.5rem 5rem 1.5rem' }}>
      <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }} className="admin-layout">
        {/* Admin Navigation Sidebar */}
        <AdminSidebar />

        {/* Dashboard Main Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '2rem',
              flexWrap: 'wrap',
              gap: '1rem',
            }}
          >
            <div>
              <h1
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '2rem',
                  fontWeight: 800,
                  color: '#fff',
                }}
              >
                Executive Dashboard
              </h1>
              <p style={{ color: '#94a3b8', fontSize: '0.88rem' }}>
                System-wide ticketing revenue, active movies, and occupancy metrics.
              </p>
            </div>

            {/* Quick Actions */}
            <div style={{ display: 'flex', gap: '0.6rem' }}>
              <Link to="/admin/movies" className="btn-primary" style={{ padding: '0.55rem 1rem', fontSize: '0.85rem' }}>
                <PlusCircle size={16} />
                <span>Manage Movies</span>
              </Link>
              <Link to="/admin/shows" className="btn-secondary" style={{ padding: '0.55rem 1rem', fontSize: '0.85rem' }}>
                <Calendar size={16} />
                <span>Schedule Show</span>
              </Link>
            </div>
          </div>

          {/* Stats Cards Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '1.25rem',
              marginBottom: '2.5rem',
            }}
          >
            <AdminStatsCard
              title="Total Revenue"
              value={`$${stats.totalRevenue.toLocaleString()}`}
              icon={DollarSign}
              color="#ffb703"
              subtitle="Confirmed online bookings"
            />
            <AdminStatsCard
              title="Tickets Sold"
              value={stats.totalTicketsSold.toLocaleString()}
              icon={Ticket}
              color="#e50914"
              subtitle="Admission passes issued"
            />
            <AdminStatsCard
              title="Active Movies"
              value={stats.totalMovies}
              icon={Film}
              color="#3b82f6"
              subtitle="Now playing & coming soon"
            />
            <AdminStatsCard
              title="Scheduled Shows"
              value={stats.totalShows}
              icon={Calendar}
              color="#10b981"
              subtitle="Active cinema screenings"
            />
          </div>

          {/* 2-Column Section: Top Movies & Recent Bookings */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
              gap: '1.75rem',
            }}
          >
            {/* Top Movies by Revenue */}
            <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '18px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                  paddingBottom: '0.85rem',
                  marginBottom: '1rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <TrendingUp size={18} color="#ffb703" />
                  <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem', color: '#fff' }}>
                    Top Performing Titles
                  </h3>
                </div>
                <Link to="/admin/movies" style={{ color: '#ffb703', fontSize: '0.8rem', fontWeight: 600 }}>
                  View All
                </Link>
              </div>

              {topMovies.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b', fontSize: '0.88rem' }}>
                  No sales data recorded yet.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {topMovies.map((movie) => (
                    <div
                      key={movie._id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.65rem 0.75rem',
                        backgroundColor: 'rgba(255, 255, 255, 0.03)',
                        borderRadius: '10px',
                        border: '1px solid rgba(255, 255, 255, 0.06)',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <img
                          src={movie.poster}
                          alt={movie.title}
                          style={{
                            width: '36px',
                            height: '52px',
                            objectFit: 'cover',
                            borderRadius: '6px',
                          }}
                        />
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#fff' }}>
                            {movie.title}
                          </div>
                          <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                            {movie.tickets} tickets sold
                          </div>
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#ffb703' }}>
                          ${movie.revenue}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Bookings Table */}
            <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '18px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                  paddingBottom: '0.85rem',
                  marginBottom: '1rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Ticket size={18} color="#e50914" />
                  <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem', color: '#fff' }}>
                    Recent Bookings
                  </h3>
                </div>
                <Link to="/admin/bookings" style={{ color: '#ffb703', fontSize: '0.8rem', fontWeight: 600 }}>
                  View All
                </Link>
              </div>

              {recentBookings.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b', fontSize: '0.88rem' }}>
                  No recent bookings.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {recentBookings.map((b) => (
                    <div
                      key={b._id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.65rem 0.75rem',
                        backgroundColor: 'rgba(255, 255, 255, 0.03)',
                        borderRadius: '10px',
                        fontSize: '0.85rem',
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <span style={{ fontWeight: 800, color: '#ffb703', fontSize: '0.8rem' }}>
                            {b.bookingId}
                          </span>
                          <span className={`badge ${b.bookingStatus === 'confirmed' ? 'badge-emerald' : 'badge-crimson'}`} style={{ fontSize: '0.65rem' }}>
                            {b.bookingStatus}
                          </span>
                        </div>
                        <div style={{ color: '#fff', fontWeight: 600, marginTop: '0.2rem' }}>
                          {b.movie?.title}
                        </div>
                        <div style={{ color: '#94a3b8', fontSize: '0.75rem' }}>
                          {b.user?.name} • {b.seats?.length} seats
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: 800, color: '#fff' }}>${b.totalAmount}</div>
                        <Link
                          to={`/confirmation/${b._id}`}
                          style={{
                            fontSize: '0.72rem',
                            color: '#38bdf8',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.2rem',
                            marginTop: '0.2rem',
                          }}
                        >
                          <span>Pass</span>
                          <ExternalLink size={10} />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .admin-layout {
            flex-direction: column !important;
          }
          .admin-layout aside {
            width: 100% !important;
            min-height: auto !important;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminDashboardPage;

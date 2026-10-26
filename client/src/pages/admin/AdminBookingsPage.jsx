import React, { useState, useEffect } from 'react';
import { adminApi } from '../../api/adminApi';
import { bookingApi } from '../../api/bookingApi';
import AdminSidebar from '../../components/admin/AdminSidebar';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import {
  Ticket,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [totalBookings, setTotalBookings] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('All');
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const params = { page, limit: 12 };
      if (status !== 'All') params.status = status;
      if (search.trim()) params.search = search.trim();

      const res = await adminApi.getAllBookings(params);
      setBookings(res.bookings || []);
      setTotalPages(res.totalPages || 1);
      setTotalBookings(res.total || 0);
    } catch (err) {
      console.error('Error fetching admin bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [page, status]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchBookings();
  };

  const handleCancelBooking = async (id, bookingRef) => {
    if (window.confirm(`Cancel booking ${bookingRef} and re-release the seats?`)) {
      try {
        await bookingApi.cancelBooking(id, { reason: 'Cancelled by administrator' });
        alert(`Booking ${bookingRef} cancelled.`);
        await fetchBookings();
      } catch (err) {
        alert(err.message || 'Failed to cancel booking');
      }
    }
  };

  return (
    <div className="container" style={{ padding: '2rem 1.5rem 5rem 1.5rem' }}>
      <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }} className="admin-layout">
        <AdminSidebar />

        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Header */}
          <div style={{ marginBottom: '2rem' }}>
            <h1
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '2rem',
                fontWeight: 800,
                color: '#fff',
                marginBottom: '0.35rem',
              }}
            >
              Customer Bookings & Orders
            </h1>
            <p style={{ color: '#94a3b8', fontSize: '0.88rem' }}>
              Inspect all completed ticket orders, monitor payment status, and manage seat cancellations.
            </p>
          </div>

          {/* Search & Filters */}
          <div
            className="glass-panel"
            style={{
              padding: '1rem 1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
              marginBottom: '1.75rem',
              flexWrap: 'wrap',
            }}
          >
            <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.5rem', flex: '1 1 260px' }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <Search size={16} color="#64748b" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by Booking ID (e.g. IMV-982410)..."
                  className="form-input"
                  style={{ paddingLeft: '2.4rem', paddingTop: '0.5rem', paddingBottom: '0.5rem', fontSize: '0.85rem' }}
                />
              </div>
              <button type="submit" className="btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                Search
              </button>
            </form>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.82rem', color: '#94a3b8', fontWeight: 600 }}>Status:</span>
              <select
                value={status}
                onChange={(e) => { setStatus(e.target.value); setPage(1); }}
                className="form-select"
                style={{ width: 'auto', padding: '0.45rem 0.85rem', fontSize: '0.85rem' }}
              >
                <option value="All">All Bookings</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Bookings Table */}
          {loading ? (
            <LoadingSpinner text="Retrieving booking logs..." />
          ) : bookings.length === 0 ? (
            <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>
              No bookings found matching your search.
            </div>
          ) : (
            <div className="glass-panel" style={{ overflowX: 'auto', borderRadius: '18px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '760px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)', color: '#94a3b8', fontSize: '0.78rem', textTransform: 'uppercase' }}>
                    <th style={{ padding: '1rem 1.25rem' }}>Ref ID & Date</th>
                    <th style={{ padding: '1rem' }}>Customer</th>
                    <th style={{ padding: '1rem' }}>Movie & Cinema</th>
                    <th style={{ padding: '1rem' }}>Seats</th>
                    <th style={{ padding: '1rem' }}>Total & Status</th>
                    <th style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b) => {
                    const bDate = new Date(b.bookingDate);
                    const isCancelled = b.bookingStatus === 'cancelled';

                    return (
                      <tr
                        key={b._id}
                        style={{
                          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                        }}
                      >
                        <td style={{ padding: '0.85rem 1.25rem' }}>
                          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, color: '#ffb703', fontSize: '0.9rem' }}>
                            {b.bookingId}
                          </div>
                          <div style={{ color: '#64748b', fontSize: '0.75rem' }}>
                            {bDate.toLocaleDateString()} {bDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </td>

                        <td style={{ padding: '1rem', fontSize: '0.85rem' }}>
                          <div style={{ color: '#fff', fontWeight: 600 }}>{b.user?.name || 'Customer'}</div>
                          <div style={{ color: '#94a3b8', fontSize: '0.75rem' }}>{b.user?.email}</div>
                        </td>

                        <td style={{ padding: '1rem', fontSize: '0.85rem' }}>
                          <div style={{ color: '#cbd5e1', fontWeight: 600 }}>{b.movie?.title}</div>
                          <div style={{ color: '#64748b', fontSize: '0.75rem' }}>
                            {b.theatre?.name} ({b.show?.screenName})
                          </div>
                        </td>

                        <td style={{ padding: '1rem' }}>
                          <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
                            {b.seats?.map((s, i) => (
                              <span key={i} className="badge badge-amber" style={{ fontSize: '0.7rem' }}>
                                {s.seatNumber}
                              </span>
                            ))}
                          </div>
                        </td>

                        <td style={{ padding: '1rem', fontSize: '0.85rem' }}>
                          <div style={{ fontWeight: 800, color: '#fff' }}>${b.totalAmount}</div>
                          <span className={`badge ${isCancelled ? 'badge-crimson' : 'badge-emerald'}`} style={{ fontSize: '0.65rem' }}>
                            {b.bookingStatus}
                          </span>
                        </td>

                        <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                            <Link
                              to={`/confirmation/${b._id}`}
                              style={{ color: '#38bdf8', padding: '0.35rem' }}
                              title="View Ticket"
                            >
                              <ExternalLink size={16} />
                            </Link>

                            {!isCancelled && (
                              <button
                                type="button"
                                onClick={() => handleCancelBooking(b._id, b.bookingId)}
                                style={{ color: '#ef4444', padding: '0.35rem' }}
                                title="Cancel and Refund"
                              >
                                <XCircle size={16} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {/* Pagination */}
              {totalPages > 1 && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    padding: '1.25rem',
                    borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                  }}
                >
                  <button
                    disabled={page <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className="btn-secondary"
                    style={{ padding: '0.4rem 0.75rem' }}
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                    Page {page} of {totalPages}
                  </span>
                  <button
                    disabled={page >= totalPages}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    className="btn-secondary"
                    style={{ padding: '0.4rem 0.75rem' }}
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminBookingsPage;

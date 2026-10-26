import React, { useState, useEffect } from 'react';
import { showApi } from '../../api/showApi';
import { movieApi } from '../../api/movieApi';
import { theatreApi } from '../../api/theatreApi';
import AdminSidebar from '../../components/admin/AdminSidebar';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Modal from '../../components/common/Modal';
import {
  Calendar,
  Plus,
  Trash2,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Film,
} from 'lucide-react';

const AdminShowsPage = () => {
  const [shows, setShows] = useState([]);
  const [movies, setMovies] = useState([]);
  const [theatres, setTheatres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  // Schedule show form
  const initialForm = {
    movie: '',
    theatre: '',
    screenName: '',
    showTime: '',
    vipPrice: 350,
    premiumPrice: 250,
    standardPrice: 180,
  };
  const [form, setForm] = useState(initialForm);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [showsRes, moviesRes, theatresRes] = await Promise.all([
        showApi.getShows(),
        movieApi.getMovies({ limit: 100 }),
        theatreApi.getTheatres(),
      ]);
      setShows(showsRes.shows || []);
      setMovies(moviesRes.movies || []);
      setTheatres(theatresRes.theatres || []);

      // Defaults for form
      if (moviesRes.movies?.length > 0 && theatresRes.theatres?.length > 0) {
        const firstTheatre = theatresRes.theatres[0];
        setForm((prev) => ({
          ...prev,
          movie: moviesRes.movies[0]._id,
          theatre: firstTheatre._id,
          screenName: firstTheatre.screens?.[0]?.name || 'Audi 1',
        }));
      }
    } catch (err) {
      setFeedback({ type: 'error', message: 'Failed to load scheduling data.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleTheatreChange = (theatreId) => {
    const selected = theatres.find((t) => t._id === theatreId);
    setForm({
      ...form,
      theatre: theatreId,
      screenName: selected?.screens?.[0]?.name || 'Audi 1',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.movie || !form.theatre || !form.showTime) {
      alert('Please fill all required scheduling fields');
      return;
    }

    try {
      setSubmitting(true);
      setFeedback({ type: '', message: '' });

      const payload = {
        movie: form.movie,
        theatre: form.theatre,
        screenName: form.screenName,
        showTime: new Date(form.showTime).toISOString(),
        pricing: {
          vip: Number(form.vipPrice),
          premium: Number(form.premiumPrice),
          standard: Number(form.standardPrice),
        },
      };

      await showApi.createShow(payload);
      setFeedback({ type: 'success', message: 'Showtime scheduled successfully!' });
      setModalOpen(false);
      await fetchData();
    } catch (err) {
      alert(err.message || 'Failed to schedule show');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, movieTitle) => {
    if (window.confirm(`Delete showtime for "${movieTitle}"?`)) {
      try {
        await showApi.deleteShow(id);
        setFeedback({ type: 'success', message: 'Showtime deleted.' });
        await fetchData();
      } catch (err) {
        alert(err.message || 'Cannot delete show with booked tickets');
      }
    }
  };

  return (
    <div className="container" style={{ padding: '2rem 1.5rem 5rem 1.5rem' }}>
      <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }} className="admin-layout">
        <AdminSidebar />

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
                Screenings & Showtimes
              </h1>
              <p style={{ color: '#94a3b8', fontSize: '0.88rem' }}>
                Schedule daily movie showtimes across cinema screens and manage ticket pricing tiers.
              </p>
            </div>

            <button onClick={() => setModalOpen(true)} className="btn-primary" style={{ padding: '0.65rem 1.25rem' }}>
              <Plus size={18} />
              <span>Schedule New Show</span>
            </button>
          </div>

          {feedback.message && (
            <div
              style={{
                backgroundColor: feedback.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                border: `1px solid ${feedback.type === 'success' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                color: feedback.type === 'success' ? '#34d399' : '#ef4444',
                padding: '0.75rem 1rem',
                borderRadius: '10px',
                marginBottom: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.9rem',
              }}
            >
              {feedback.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
              <span>{feedback.message}</span>
            </div>
          )}

          {/* Shows Table */}
          {loading ? (
            <LoadingSpinner text="Loading screenings schedule..." />
          ) : (
            <div className="glass-panel" style={{ overflowX: 'auto', borderRadius: '18px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '700px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)', color: '#94a3b8', fontSize: '0.78rem', textTransform: 'uppercase' }}>
                    <th style={{ padding: '1rem 1.25rem' }}>Movie</th>
                    <th style={{ padding: '1rem' }}>Theatre & Screen</th>
                    <th style={{ padding: '1rem' }}>Date & Showtime</th>
                    <th style={{ padding: '1rem' }}>Pricing Tiers</th>
                    <th style={{ padding: '1rem' }}>Occupancy</th>
                    <th style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {shows.map((s) => {
                    const showDate = new Date(s.showTime);
                    const dateStr = showDate.toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                    });
                    const timeStr = showDate.toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                    });

                    const totalSeats = s.seatLayout?.length || 60;
                    const bookedCount = s.bookedSeats?.length || 0;
                    const occupancyPct = Math.round((bookedCount / totalSeats) * 100);

                    return (
                      <tr
                        key={s._id}
                        style={{
                          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                        }}
                      >
                        <td style={{ padding: '0.85rem 1.25rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <img
                              src={s.movie?.poster}
                              alt={s.movie?.title}
                              style={{ width: '38px', height: '54px', objectFit: 'cover', borderRadius: '6px' }}
                            />
                            <div>
                              <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.92rem' }}>
                                {s.movie?.title}
                              </div>
                              <div style={{ color: '#64748b', fontSize: '0.78rem' }}>
                                {s.movie?.language} • {s.movie?.runtime}m
                              </div>
                            </div>
                          </div>
                        </td>

                        <td style={{ padding: '1rem', fontSize: '0.85rem' }}>
                          <div style={{ color: '#cbd5e1', fontWeight: 600 }}>{s.theatre?.name}</div>
                          <div style={{ color: '#ffb703', fontSize: '0.78rem' }}>{s.screenName}</div>
                        </td>

                        <td style={{ padding: '1rem', fontSize: '0.85rem' }}>
                          <div style={{ color: '#fff', fontWeight: 700 }}>{timeStr}</div>
                          <div style={{ color: '#94a3b8', fontSize: '0.78rem' }}>{dateStr}</div>
                        </td>

                        <td style={{ padding: '1rem', fontSize: '0.82rem', color: '#cbd5e1' }}>
                          <div>VIP: ${s.pricing?.vip}</div>
                          <div style={{ color: '#94a3b8' }}>Prem: ${s.pricing?.premium} | Std: ${s.pricing?.standard}</div>
                        </td>

                        <td style={{ padding: '1rem', width: '150px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.25rem' }}>
                            <span style={{ color: '#cbd5e1' }}>{bookedCount}/{totalSeats}</span>
                            <span style={{ color: '#ffb703', fontWeight: 700 }}>{occupancyPct}%</span>
                          </div>
                          <div style={{ width: '100%', height: '6px', backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                            <div style={{ width: `${occupancyPct}%`, height: '100%', backgroundColor: occupancyPct > 70 ? '#e50914' : '#ffb703' }} />
                          </div>
                        </td>

                        <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                          <button
                            type="button"
                            onClick={() => handleDelete(s._id, s.movie?.title)}
                            style={{
                              padding: '0.4rem',
                              borderRadius: '6px',
                              color: '#ef4444',
                              backgroundColor: 'rgba(239, 68, 68, 0.1)',
                            }}
                            title="Delete Showtime"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Schedule Show Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Schedule New Movie Screening"
        maxWidth="580px"
      >
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Select Movie *</label>
            <select
              value={form.movie}
              onChange={(e) => setForm({ ...form, movie: e.target.value })}
              required
              className="form-select"
            >
              {movies.map((m) => (
                <option key={m._id} value={m._id}>
                  {m.title} ({m.language})
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Select Cinema Theatre *</label>
              <select
                value={form.theatre}
                onChange={(e) => handleTheatreChange(e.target.value)}
                required
                className="form-select"
              >
                {theatres.map((t) => (
                  <option key={t._id} value={t._id}>
                    {t.name} ({t.location?.city})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Auditorium / Screen *</label>
              <select
                value={form.screenName}
                onChange={(e) => setForm({ ...form, screenName: e.target.value })}
                required
                className="form-select"
              >
                {theatres
                  .find((t) => t._id === form.theatre)
                  ?.screens?.map((s) => (
                    <option key={s.screenNumber} value={s.name}>
                      {s.name}
                    </option>
                  )) || <option value="Audi 1">Audi 1</option>}
              </select>
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Screening Date & Time *</label>
            <input
              type="datetime-local"
              value={form.showTime}
              onChange={(e) => setForm({ ...form, showTime: e.target.value })}
              required
              className="form-input"
            />
          </div>

          {/* Pricing Tiers */}
          <div>
            <label className="form-label" style={{ marginBottom: '0.4rem' }}>Pricing Tiers ($)</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#8b5cf6', fontWeight: 700 }}>VIP Recliner</span>
                <input
                  type="number"
                  value={form.vipPrice}
                  onChange={(e) => setForm({ ...form, vipPrice: e.target.value })}
                  className="form-input"
                />
              </div>

              <div>
                <span style={{ fontSize: '0.75rem', color: '#3b82f6', fontWeight: 700 }}>Premium</span>
                <input
                  type="number"
                  value={form.premiumPrice}
                  onChange={(e) => setForm({ ...form, premiumPrice: e.target.value })}
                  className="form-input"
                />
              </div>

              <div>
                <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 700 }}>Standard</span>
                <input
                  type="number"
                  value={form.standardPrice}
                  onChange={(e) => setForm({ ...form, standardPrice: e.target.value })}
                  className="form-input"
                />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={submitting} className="btn-primary">
              {submitting ? 'Scheduling...' : 'Save Showtime'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminShowsPage;

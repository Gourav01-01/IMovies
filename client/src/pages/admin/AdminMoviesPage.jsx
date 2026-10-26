import React, { useState, useEffect } from 'react';
import { movieApi } from '../../api/movieApi';
import AdminSidebar from '../../components/admin/AdminSidebar';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Modal from '../../components/common/Modal';
import {
  Film,
  Plus,
  Edit2,
  Trash2,
  Star,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';

const AdminMoviesPage = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  // Form State
  const initialForm = {
    title: '',
    description: '',
    poster: '',
    backdrop: '',
    genre: 'Action, Sci-Fi',
    language: 'English',
    runtime: 140,
    rating: 8.5,
    releaseDate: new Date().toISOString().split('T')[0],
    status: 'now_showing',
    certificate: 'UA',
    director: '',
    cast: '',
    trailerUrl: '',
  };
  const [form, setForm] = useState(initialForm);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      const res = await movieApi.getMovies({ limit: 100 });
      setMovies(res.movies || []);
    } catch (err) {
      setFeedback({ type: 'error', message: 'Failed to load movies.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const handleOpenAdd = () => {
    setEditingMovie(null);
    setForm(initialForm);
    setModalOpen(true);
  };

  const handleOpenEdit = (movie) => {
    setEditingMovie(movie);
    setForm({
      title: movie.title || '',
      description: movie.description || '',
      poster: movie.poster || '',
      backdrop: movie.backdrop || '',
      genre: Array.isArray(movie.genre) ? movie.genre.join(', ') : movie.genre || '',
      language: movie.language || 'English',
      runtime: movie.runtime || 120,
      rating: movie.rating || 8.0,
      releaseDate: movie.releaseDate ? new Date(movie.releaseDate).toISOString().split('T')[0] : '',
      status: movie.status || 'now_showing',
      certificate: movie.certificate || 'UA',
      director: movie.director || '',
      cast: Array.isArray(movie.cast) ? movie.cast.join(', ') : movie.cast || '',
      trailerUrl: movie.trailerUrl || '',
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setFeedback({ type: '', message: '' });

      const payload = {
        ...form,
        runtime: Number(form.runtime),
        rating: Number(form.rating),
      };

      if (editingMovie) {
        await movieApi.updateMovie(editingMovie._id, payload);
        setFeedback({ type: 'success', message: 'Movie updated successfully!' });
      } else {
        await movieApi.createMovie(payload);
        setFeedback({ type: 'success', message: 'Movie created successfully!' });
      }

      setModalOpen(false);
      await fetchMovies();
    } catch (err) {
      alert(err.message || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}" and all its scheduled shows?`)) {
      try {
        await movieApi.deleteMovie(id);
        setFeedback({ type: 'success', message: `Deleted "${title}" successfully.` });
        await fetchMovies();
      } catch (err) {
        alert(err.message || 'Failed to delete movie');
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
                Movies Management
              </h1>
              <p style={{ color: '#94a3b8', fontSize: '0.88rem' }}>
                Add, update, or remove movies playing across all cinema theatres.
              </p>
            </div>

            <button onClick={handleOpenAdd} className="btn-primary" style={{ padding: '0.65rem 1.25rem' }}>
              <Plus size={18} />
              <span>Add New Movie</span>
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

          {/* Movies Table */}
          {loading ? (
            <LoadingSpinner text="Loading movies catalog..." />
          ) : (
            <div className="glass-panel" style={{ overflowX: 'auto', borderRadius: '18px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '650px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)', color: '#94a3b8', fontSize: '0.78rem', textTransform: 'uppercase' }}>
                    <th style={{ padding: '1rem 1.25rem' }}>Poster & Title</th>
                    <th style={{ padding: '1rem' }}>Genre & Lang</th>
                    <th style={{ padding: '1rem' }}>Runtime & Cert</th>
                    <th style={{ padding: '1rem' }}>Rating</th>
                    <th style={{ padding: '1rem' }}>Status</th>
                    <th style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {movies.map((m) => (
                    <tr
                      key={m._id}
                      style={{
                        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                        transition: 'background 120ms',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.03)')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <td style={{ padding: '0.85rem 1.25rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <img
                            src={m.poster}
                            alt={m.title}
                            style={{ width: '42px', height: '60px', objectFit: 'cover', borderRadius: '6px' }}
                          />
                          <div>
                            <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.95rem' }}>
                              {m.title}
                            </div>
                            <div style={{ color: '#64748b', fontSize: '0.78rem' }}>
                              {m.director || 'Director unspecified'}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td style={{ padding: '1rem', fontSize: '0.85rem', color: '#cbd5e1' }}>
                        <div>{Array.isArray(m.genre) ? m.genre.slice(0, 2).join(', ') : m.genre}</div>
                        <div style={{ color: '#94a3b8', fontSize: '0.75rem' }}>{m.language}</div>
                      </td>

                      <td style={{ padding: '1rem', fontSize: '0.85rem', color: '#cbd5e1' }}>
                        <div>{m.runtime} min</div>
                        <span className="badge badge-purple" style={{ fontSize: '0.68rem', marginTop: '0.2rem' }}>
                          {m.certificate || 'UA'}
                        </span>
                      </td>

                      <td style={{ padding: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#ffb703', fontWeight: 700, fontSize: '0.88rem' }}>
                          <Star size={14} fill="#ffb703" />
                          <span>{m.rating ? m.rating.toFixed(1) : '8.0'}</span>
                        </div>
                      </td>

                      <td style={{ padding: '1rem' }}>
                        <span className={`badge ${m.status === 'now_showing' ? 'badge-emerald' : 'badge-amber'}`}>
                          {m.status === 'now_showing' ? 'Now Showing' : 'Coming Soon'}
                        </span>
                      </td>

                      <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.4rem' }}>
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(m)}
                            style={{
                              padding: '0.4rem',
                              borderRadius: '6px',
                              color: '#ffb703',
                              backgroundColor: 'rgba(255, 183, 3, 0.1)',
                            }}
                            title="Edit Movie"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(m._id, m.title)}
                            style={{
                              padding: '0.4rem',
                              borderRadius: '6px',
                              color: '#ef4444',
                              backgroundColor: 'rgba(239, 68, 68, 0.1)',
                            }}
                            title="Delete Movie"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add / Edit Movie Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingMovie ? 'Edit Cinema Movie' : 'Add New Cinema Movie'}
        maxWidth="680px"
      >
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Movie Title *</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
                className="form-input"
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Language *</label>
              <input
                type="text"
                value={form.language}
                onChange={(e) => setForm({ ...form, language: e.target.value })}
                required
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Synopsis / Description *</label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              required
              className="form-textarea"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Poster Image URL *</label>
              <input
                type="url"
                value={form.poster}
                onChange={(e) => setForm({ ...form, poster: e.target.value })}
                placeholder="https://..."
                required
                className="form-input"
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Backdrop Image URL</label>
              <input
                type="url"
                value={form.backdrop}
                onChange={(e) => setForm({ ...form, backdrop: e.target.value })}
                placeholder="https://..."
                className="form-input"
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Runtime (min) *</label>
              <input
                type="number"
                value={form.runtime}
                onChange={(e) => setForm({ ...form, runtime: e.target.value })}
                required
                min={1}
                className="form-input"
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Rating (0-10)</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="10"
                value={form.rating}
                onChange={(e) => setForm({ ...form, rating: e.target.value })}
                className="form-input"
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Status *</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="form-select"
              >
                <option value="now_showing">Now Showing</option>
                <option value="coming_soon">Coming Soon</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Genres (comma separated)</label>
              <input
                type="text"
                value={form.genre}
                onChange={(e) => setForm({ ...form, genre: e.target.value })}
                placeholder="Action, Sci-Fi, Adventure"
                className="form-input"
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Release Date</label>
              <input
                type="date"
                value={form.releaseDate}
                onChange={(e) => setForm({ ...form, releaseDate: e.target.value })}
                className="form-input"
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Director</label>
              <input
                type="text"
                value={form.director}
                onChange={(e) => setForm({ ...form, director: e.target.value })}
                className="form-input"
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Cast (comma separated)</label>
              <input
                type="text"
                value={form.cast}
                onChange={(e) => setForm({ ...form, cast: e.target.value })}
                className="form-input"
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={submitting} className="btn-primary">
              {submitting ? 'Saving...' : editingMovie ? 'Update Movie' : 'Create Movie'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminMoviesPage;

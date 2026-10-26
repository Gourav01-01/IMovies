import React, { useState, useEffect } from 'react';
import { theatreApi } from '../../api/theatreApi';
import AdminSidebar from '../../components/admin/AdminSidebar';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Modal from '../../components/common/Modal';
import { Building, Plus, Trash2, MapPin, CheckCircle2, AlertCircle } from 'lucide-react';

const AdminTheatresPage = () => {
  const [theatres, setTheatres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  const initialForm = {
    name: '',
    address: '',
    city: 'New York',
    state: 'NY',
    pincode: '10001',
    amenities: 'IMAX 4K Laser, Dolby Atmos, Recliner Lounges',
    screenCount: 2,
  };
  const [form, setForm] = useState(initialForm);

  const fetchTheatres = async () => {
    try {
      setLoading(true);
      const res = await theatreApi.getTheatres();
      setTheatres(res.theatres || []);
    } catch (err) {
      setFeedback({ type: 'error', message: 'Failed to load theatres.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTheatres();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setFeedback({ type: '', message: '' });

      const amenitiesList = form.amenities
        .split(',')
        .map((a) => a.trim())
        .filter(Boolean);

      const screens = [];
      const numScreens = parseInt(form.screenCount, 10) || 1;
      for (let i = 1; i <= numScreens; i++) {
        screens.push({
          screenNumber: i,
          name: `Audi ${i} - ${i === 1 ? 'IMAX Laser 4K' : 'Dolby Atmos'}`,
          totalSeats: 60,
          vipRows: ['A', 'B'],
          premiumRows: ['C', 'D'],
          standardRows: ['E', 'F'],
          seatsPerRow: 10,
        });
      }

      const payload = {
        name: form.name,
        location: {
          address: form.address,
          city: form.city,
          state: form.state,
          pincode: form.pincode,
        },
        amenities: amenitiesList,
        screens,
      };

      await theatreApi.createTheatre(payload);
      setFeedback({ type: 'success', message: 'Theatre added successfully!' });
      setModalOpen(false);
      setForm(initialForm);
      await fetchTheatres();
    } catch (err) {
      alert(err.message || 'Failed to add theatre');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Delete "${name}" and all associated scheduled showtimes?`)) {
      try {
        await theatreApi.deleteTheatre(id);
        setFeedback({ type: 'success', message: `Theatre "${name}" removed.` });
        await fetchTheatres();
      } catch (err) {
        alert(err.message || 'Failed to delete theatre');
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
                Theatres & Venues
              </h1>
              <p style={{ color: '#94a3b8', fontSize: '0.88rem' }}>
                Configure cinema complexes, screen layouts, and city locations.
              </p>
            </div>

            <button onClick={() => setModalOpen(true)} className="btn-primary" style={{ padding: '0.65rem 1.25rem' }}>
              <Plus size={18} />
              <span>Add Theatre</span>
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

          {/* Theatres List */}
          {loading ? (
            <LoadingSpinner text="Loading theatre venues..." />
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
              {theatres.map((t) => (
                <div
                  key={t._id}
                  className="glass-panel"
                  style={{
                    padding: '1.5rem',
                    borderRadius: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span className="badge badge-amber">{t.location?.city}</span>
                      <button
                        type="button"
                        onClick={() => handleDelete(t._id, t.name)}
                        style={{ color: '#ef4444', padding: '0.3rem' }}
                        title="Delete Theatre"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 700, color: '#fff', marginBottom: '0.35rem' }}>
                      {t.name}
                    </h3>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#94a3b8', fontSize: '0.82rem', marginBottom: '1rem' }}>
                      <MapPin size={14} color="#e50914" />
                      <span>{t.location?.address}</span>
                    </div>

                    {/* Screens summary */}
                    <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)', padding: '0.75rem', borderRadius: '10px', marginBottom: '1rem' }}>
                      <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                        Screens ({t.screens?.length || 0})
                      </div>
                      <div style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>
                        {t.screens?.map((s) => s.name).join(', ') || 'Default Screens'}
                      </div>
                    </div>
                  </div>

                  {/* Amenities */}
                  <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                    {t.amenities?.map((a, i) => (
                      <span key={i} className="badge badge-purple" style={{ fontSize: '0.68rem' }}>
                        {a}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Theatre Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Add New Cinema Theatre"
        maxWidth="540px"
      >
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Theatre Name *</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. IMovies Grand Luxe"
              required
              className="form-input"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '0.75rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">City *</label>
              <input
                type="text"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                required
                className="form-input"
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">State</label>
              <input
                type="text"
                value={form.state}
                onChange={(e) => setForm({ ...form, state: e.target.value })}
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Street Address *</label>
            <input
              type="text"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              placeholder="e.g. 120 Broadway Avenue"
              required
              className="form-input"
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Amenities (comma separated)</label>
            <input
              type="text"
              value={form.amenities}
              onChange={(e) => setForm({ ...form, amenities: e.target.value })}
              className="form-input"
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Number of Screens to Provision</label>
            <input
              type="number"
              min={1}
              max={8}
              value={form.screenCount}
              onChange={(e) => setForm({ ...form, screenCount: e.target.value })}
              className="form-input"
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={submitting} className="btn-primary">
              {submitting ? 'Creating...' : 'Create Theatre'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminTheatresPage;

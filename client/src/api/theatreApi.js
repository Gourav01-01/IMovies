import api from './client';

export const theatreApi = {
  getTheatres: (params = {}) => api.get('/theatres', { params }),
  getTheatreById: (id) => api.get(`/theatres/${id}`),
  createTheatre: (data) => api.post('/theatres', data),
  updateTheatre: (id, data) => api.put(`/theatres/${id}`, data),
  deleteTheatre: (id) => api.delete(`/theatres/${id}`),
};

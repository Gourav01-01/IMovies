import api from './client';

export const showApi = {
  getShows: (params = {}) => api.get('/shows', { params }),
  getShowById: (id) => api.get(`/shows/${id}`),
  createShow: (data) => api.post('/shows', data),
  updateShow: (id, data) => api.put(`/shows/${id}`, data),
  deleteShow: (id) => api.delete(`/shows/${id}`),
};

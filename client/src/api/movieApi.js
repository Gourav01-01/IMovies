import api from './client';

export const movieApi = {
  getMovies: (params = {}) => api.get('/movies', { params }),
  getMovieById: (id, params = {}) => api.get(`/movies/${id}`, { params }),
  getFilters: () => api.get('/movies/filters/all'),
  createMovie: (formData) =>
    api.post('/movies', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  updateMovie: (id, formData) =>
    api.put(`/movies/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  deleteMovie: (id) => api.delete(`/movies/${id}`),
};

import api from './client';

export const adminApi = {
  getStats: () => api.get('/admin/stats'),
  getAllBookings: (params = {}) => api.get('/admin/bookings', { params }),
};

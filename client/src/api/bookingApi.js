import api from './client';

export const bookingApi = {
  createBooking: (bookingData) => api.post('/bookings', bookingData),
  getMyBookings: (params = {}) => api.get('/bookings/my', { params }),
  getBookingById: (id) => api.get(`/bookings/${id}`),
  cancelBooking: (id, data = {}) => api.put(`/bookings/${id}/cancel`, data),
};

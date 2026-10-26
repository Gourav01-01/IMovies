const express = require('express');
const router = express.Router();
const {
  getMovies,
  getMovieById,
  getMovieFilters,
  createMovie,
  updateMovie,
  deleteMovie,
} = require('../controllers/movieController');
const { protect, authorizeAdmin } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', getMovies);
router.get('/filters/all', getMovieFilters);
router.get('/:id', getMovieById);

router.post('/', protect, authorizeAdmin, upload.single('posterFile'), createMovie);
router.put('/:id', protect, authorizeAdmin, upload.single('posterFile'), updateMovie);
router.delete('/:id', protect, authorizeAdmin, deleteMovie);

module.exports = router;

const express = require('express');
const router = express.Router();
const {
  getTheatres,
  getTheatreById,
  createTheatre,
  updateTheatre,
  deleteTheatre,
} = require('../controllers/theatreController');
const { protect, authorizeAdmin } = require('../middleware/auth');

router.get('/', getTheatres);
router.get('/:id', getTheatreById);

router.post('/', protect, authorizeAdmin, createTheatre);
router.put('/:id', protect, authorizeAdmin, updateTheatre);
router.delete('/:id', protect, authorizeAdmin, deleteTheatre);

module.exports = router;

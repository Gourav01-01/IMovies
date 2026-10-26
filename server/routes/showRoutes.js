const express = require('express');
const router = express.Router();
const {
  getShows,
  getShowById,
  createShow,
  updateShow,
  deleteShow,
} = require('../controllers/showController');
const { protect, authorizeAdmin } = require('../middleware/auth');

router.get('/', getShows);
router.get('/:id', getShowById);

router.post('/', protect, authorizeAdmin, createShow);
router.put('/:id', protect, authorizeAdmin, updateShow);
router.delete('/:id', protect, authorizeAdmin, deleteShow);

module.exports = router;

const express = require('express');
const router = express.Router();
const { getHistory, deleteHistory } = require('../controllers/historyController');
const { protect } = require('../middleware/authMiddleware');

// GET  /api/history         – fetch all records for the logged-in user
router.get('/', protect, getHistory);

// DELETE /api/history/:id   – delete a single record owned by the logged-in user
router.delete('/:id', protect, deleteHistory);

module.exports = router;

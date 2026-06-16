const express = require('express');
const router = express.Router();
const {
  analyzeImage,
  getHistory,
  deleteScan,
  mockUpload
} = require('../controllers/scanController');
const { protect } = require('../middleware/authMiddleware');

// All scan routes are protected by JWT authentication
router.post('/analyze', protect, analyzeImage);
router.post('/upload', protect, mockUpload);
router.get('/history', protect, getHistory);
router.delete('/history/:id', protect, deleteScan);

module.exports = router;

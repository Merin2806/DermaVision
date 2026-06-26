const express = require('express');
const router = express.Router();
const { getRecommendationByCondition } = require('../controllers/recommendationController');

// GET /api/recommendation/:condition
router.get('/recommendation/:condition', getRecommendationByCondition);

module.exports = router;

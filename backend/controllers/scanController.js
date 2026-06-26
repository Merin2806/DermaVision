const User = require('../models/User');
const apiResponse = require('../utils/apiResponse');

// @desc    Analyze skin image and return mock AI prediction
// @route   POST /api/analyze
// @access  Private
const analyzeImage = async (req, res, next) => {
  try {
    const { imageName, imageSize, imageData } = req.body;

    // Use default mock AI response from request prompt
    let condition = 'Acne';
    let confidence = 87;
    let severity = 'Moderate';
    
    // Maintain premium recommendation templates
    let recommendations = [
      'Use a gentle non-comedogenic cleanser twice daily.',
      'Apply topical salicylic acid or benzoyl peroxide targeting active lesions.',
      'Keep skin hydrated with a lightweight, oil-free moisturizer.',
      'Avoid touching or picking active breakouts.'
    ];

    // Optional: Dynamic mock matching if filename contains specific tags
    const nameLower = (imageName || '').toLowerCase();
    if (nameLower.includes('eczema') || nameLower.includes('dermatitis')) {
      condition = 'Eczema / Dermatitis';
      confidence = 94.2;
      severity = 'Mild';
      recommendations = [
        'Apply thick emollient creams within 3 minutes after bathing.',
        'Use mild, fragrance-free soaps and laundry detergents.',
        'Identify and avoid environmental triggers (e.g., specific fabrics, excessive heat).',
        'Consult a dermatologist for potential topical corticosteroid treatment.'
      ];
    } else if (nameLower.includes('psoriasis')) {
      condition = 'Psoriasis';
      confidence = 93.5;
      severity = 'Severe';
      recommendations = [
        'Keep the skin well-lubricated with dense ointments or oils.',
        'Consult a dermatologist regarding prescription topical vitamin D analogues.',
        'Discuss systemic therapies or phototherapy options for wider coverage.',
        'Incorporate omega-3 fatty acids and anti-inflammatory foods into your diet.'
      ];
    } else if (nameLower.includes('fungal') || nameLower.includes('ringworm') || nameLower.includes('tinea')) {
      condition = 'Fungal Infections (Tinea)';
      confidence = 95.1;
      severity = 'Mild';
      recommendations = [
        'Keep the affected area clean and dry at all times.',
        'Apply over-the-counter topical antifungal creams as directed.',
        'Avoid sharing clothing, towels, or personal items.',
        'Wear breathable, loose-fitting cotton clothing.'
      ];
    }

    const newScan = {
      id: `scan-${Date.now()}`,
      date: new Date(),
      condition,
      confidence,
      severity,
      imageUrl: imageData || null,
      recommendations,
    };

    // Save scan to user's scans list in MongoDB
    const user = await User.findById(req.user._id);
    if (!user) {
      return apiResponse.notFound(res, 'User not found');
    }

    // Add scan to top of history
    user.scans.unshift(newScan);
    await user.save();

    return apiResponse.success(res, 'Image analyzed successfully.', newScan);
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's scan history
// @route   GET /api/history
// @access  Private
const getHistory = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return apiResponse.notFound(res, 'User not found');
    }
    return apiResponse.success(res, 'Scan history retrieved successfully.', user.scans);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a specific scan from history
// @route   DELETE /api/history/:id
// @access  Private
const deleteScan = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return apiResponse.notFound(res, 'User not found');
    }

    // Filter out the scan
    const initialLength = user.scans.length;
    user.scans = user.scans.filter(s => s.id !== req.params.id);

    if (user.scans.length === initialLength) {
      return apiResponse.notFound(res, 'Scan record not found');
    }

    await user.save();
    return apiResponse.success(res, 'Scan deleted successfully.');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  analyzeImage,
  getHistory,
  deleteScan
};

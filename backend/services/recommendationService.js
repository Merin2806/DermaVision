const diseases = require('../data/diseases.json');

/**
 * Get recommendation details for a given condition.
 * 
 * @param {Object} input - The input object.
 * @param {string} input.condition - The name of the skin condition to look up.
 * @returns {Promise<Object|null>} The matching disease information or null.
 */
const getRecommendation = async ({ condition }) => {
  if (!condition) {
    return null;
  }

  const normalizedQuery = condition.trim().toLowerCase();

  // Find matching disease, ignoring case differences
  const matchedDisease = diseases.find(
    (disease) => disease.name.toLowerCase() === normalizedQuery
  );

  return matchedDisease || null;
};

module.exports = {
  getRecommendation
};

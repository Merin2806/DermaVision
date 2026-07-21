const diseases = require('../data/diseases.json');

/**
 * Get recommendation details for a given condition with exact and partial matching.
 * 
 * @param {Object} input
 * @param {string} input.condition - Skin condition name
 * @returns {Promise<Object|null>} Matching disease info or fallback.
 */
const getRecommendation = async ({ condition }) => {
  if (!condition) return null;

  const query = condition.trim().toLowerCase();

  // 1. Exact match
  let matched = diseases.find((d) => d.name.toLowerCase() === query);

  // 2. Starts with / includes match
  if (!matched) {
    matched = diseases.find((d) => 
      d.name.toLowerCase().includes(query) || query.includes(d.name.toLowerCase())
    );
  }

  // 3. First token match (e.g. "Acne", "Psoriasis", "Eczema")
  if (!matched) {
    const mainKey = query.split(' ')[0];
    if (mainKey.length > 3) {
      matched = diseases.find((d) => d.name.toLowerCase().includes(mainKey));
    }
  }

  // 4. Fallback to first disease if unknown
  if (!matched) {
    matched = diseases[0];
  }

  return matched;
};

module.exports = {
  getRecommendation
};


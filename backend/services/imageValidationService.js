const sharp = require('sharp');
const path = require('path');

// Minimum dimension requirements
const MIN_WIDTH = 224;
const MIN_HEIGHT = 224;

// Brightness thresholds (0-255 scale, per-channel mean)
const DARK_THRESHOLD = 40;   // Average pixel value below this → too dark
const BRIGHT_THRESHOLD = 215; // Average pixel value above this → too bright

/**
 * Validate an uploaded image file for:
 * - File existence
 * - Image corruption (unreadable)
 * - Minimum dimensions (224x224)
 * - Brightness quality warnings (too dark / too bright)
 *
 * FUTURE COMPATIBILITY:
 * Extend this service with additional checks (blur detection,
 * skin area detection, AI preprocessing) without changing the
 * middleware or controller.
 *
 * @param {Object} file - Multer file object (req.file)
 * @returns {Promise<Object>} Validation result:
 *   {
 *     valid: boolean,
 *     error: string|null,      // Hard failure reason (blocks prediction)
 *     warnings: string[]       // Soft warnings (do not block prediction)
 *   }
 */
const validateImage = async (file) => {
  const result = {
    valid: true,
    error: null,
    warnings: []
  };

  // 1. Check file exists
  if (!file || !file.path) {
    result.valid = false;
    result.error = 'No image file provided.';
    return result;
  }

  let imageMetadata;
  let imageStats;

  // 2. Check for corrupted image — attempt to read metadata with sharp
  try {
    const image = sharp(file.path);
    imageMetadata = await image.metadata();
    // Compute per-channel statistics for brightness check
    imageStats = await image.stats();
  } catch (err) {
    result.valid = false;
    result.error = 'The uploaded image is corrupted or unreadable. Please upload a valid image.';
    return result;
  }

  // 3. Validate image format (extra safety layer beyond Multer)
  const allowedFormats = ['jpeg', 'jpg', 'png'];
  if (!allowedFormats.includes(imageMetadata.format)) {
    result.valid = false;
    result.error = `Invalid image format: ${imageMetadata.format}. Only JPG, JPEG, and PNG are accepted.`;
    return result;
  }

  // 4. Validate minimum dimensions
  const { width, height } = imageMetadata;
  if (width < MIN_WIDTH || height < MIN_HEIGHT) {
    result.valid = false;
    result.error = `Image resolution too low (${width}x${height}). Minimum required: ${MIN_WIDTH}x${MIN_HEIGHT} pixels.`;
    return result;
  }

  // 5. Brightness quality check (warnings only — does not block prediction)
  try {
    // imageStats.channels is an array of { mean, std, min, max } per channel
    const channelMeans = imageStats.channels.map((ch) => ch.mean);
    const overallMean = channelMeans.reduce((sum, m) => sum + m, 0) / channelMeans.length;

    if (overallMean < DARK_THRESHOLD) {
      result.warnings.push('Image appears too dark.');
      result.warnings.push('Prediction accuracy may be reduced.');
    } else if (overallMean > BRIGHT_THRESHOLD) {
      result.warnings.push('Image appears too bright or overexposed.');
      result.warnings.push('Prediction accuracy may be reduced.');
    }
  } catch (statsErr) {
    // Non-critical — log and continue without brightness warnings
    console.warn('Brightness analysis failed (non-critical):', statsErr.message);
  }

  return result;
};

module.exports = {
  validateImage
};

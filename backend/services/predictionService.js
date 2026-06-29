const fs = require('fs');

/**
 * Prediction Service — Real AI Model Integration
 *
 * This service forwards the uploaded image from Multer to the FastAPI AI microservice
 * for disease classification and confidence score estimation.
 *
 * @param {Object} input
 * @param {Object} input.file - The uploaded image file object from Multer.
 * @returns {Promise<Object>} Prediction result with condition, confidence, and severity.
 */
const getPrediction = async ({ file }) => {
  if (!file || !file.path) {
    throw new Error('Invalid image file uploaded.');
  }

  // 1. Read file from local disk as buffer and wrap in a Blob
  const fileBuffer = fs.readFileSync(file.path);
  const blob = new Blob([fileBuffer], { type: file.mimetype });

  // 2. Build standard multipart form-data payload
  const formData = new FormData();
  formData.append('image', blob, file.originalname);

  // 3. Retrieve target URL from environment
  const fastapiUrl = process.env.FASTAPI_URL || 'http://127.0.0.1:8000';

  console.log(`Forwarding image '${file.originalname}' to FastAPI: ${fastapiUrl}/predict`);

  // 4. Send request to FastAPI endpoint
  const response = await fetch(`${fastapiUrl}/predict`, {
    method: 'POST',
    body: formData
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`AI prediction microservice error: Status ${response.status} - ${errorText}`);
  }

  // 5. Decode predicted disease and confidence percentage
  const result = await response.json(); // Expected: { disease: string, confidence: number }

  // 6. Future Ready Severity Placement
  // Since severity prediction is designated as a placeholder architecture hook,
  // we default/simulate severity (Mild/Moderate/Severe) for backend PDF/history compatibility.
  const SEVERITY_LEVELS = ['Mild', 'Moderate', 'Severe'];
  const severityIndex = Math.floor(Math.random() * SEVERITY_LEVELS.length);
  const severity = SEVERITY_LEVELS[severityIndex];

  return {
    condition: result.disease,
    confidence: result.confidence,
    severity: severity
  };
};

module.exports = {
  getPrediction
};

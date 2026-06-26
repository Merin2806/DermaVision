const apiResponse = require('../utils/apiResponse');

const uploadImage = async (req, res, next) => {
  try {
    // Check that a file exists
    if (!req.file) {
      return apiResponse.badRequest(res, 'Image upload failed. No image file provided.');
    }

    // Return success JSON
    return apiResponse.success(res, 'Image uploaded successfully.', {
      filename: req.file.filename,
      filepath: `uploads/${req.file.filename}`,
      uploadedAt: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadImage
};

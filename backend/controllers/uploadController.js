const uploadImage = async (req, res, next) => {
  try {
    // Check that a file exists
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Image upload failed. No image file provided.'
      });
    }

    // Return success JSON
    return res.status(200).json({
      success: true,
      message: 'Image uploaded successfully.',
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

const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const timestamp = Math.floor(Date.now() / 1000);
    const randomId = crypto.randomBytes(3).toString('hex');
    const ext = path.extname(file.originalname).toLowerCase();
    const nameWithoutExt = path.basename(file.originalname, ext);

    // Sanitize filename: convert to lowercase, replace space and invalid characters with underscores,
    // only allow letters, numbers, underscores, and hyphens.
    let sanitized = nameWithoutExt
      .toLowerCase()
      .replace(/\s+/g, '_')
      .replace(/[^a-z0-9_-]/g, '_')
      .replace(/_+/g, '_')
      .replace(/-+/g, '-')
      .replace(/^[_,-]+|[_,-]+$/g, '');

    if (!sanitized) {
      sanitized = 'file';
    }

    let finalFilename = `${timestamp}_${randomId}_${sanitized}${ext}`;

    // Guarantee that duplicate uploads never overwrite existing files
    let attempt = 0;
    while (fs.existsSync(path.join(uploadDir, finalFilename)) && attempt < 10) {
      const nextRandomId = crypto.randomBytes(3).toString('hex');
      finalFilename = `${timestamp}_${nextRandomId}_${sanitized}${ext}`;
      attempt++;
    }

    cb(null, finalFilename);
  }
});

// Configure file filter for jpg, jpeg, png
const fileFilter = (req, file, cb) => {
  const allowedExtensions = /jpeg|jpg|png/i;
  
  // Validate file extension
  const extName = allowedExtensions.test(path.extname(file.originalname).toLowerCase());
  // Validate mime type
  const mimeType = allowedExtensions.test(file.mimetype);

  if (extName && mimeType) {
    cb(null, true);
  } else {
    cb(new Error('Only jpg, jpeg, and png file types are allowed.'), false);
  }
};

// Initialize multer upload
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10 MB limit
}).single('image');

// Wrapper middleware to handle Multer validation errors
const uploadMiddleware = (req, res, next) => {
  upload(req, res, (err) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({
            success: false,
            message: 'Image upload failed. File size limit exceeded. Maximum size allowed is 10 MB.'
          });
        }
        return res.status(400).json({
          success: false,
          message: `Image upload failed. ${err.message}`
        });
      }
      return res.status(400).json({
        success: false,
        message: `Image upload failed. ${err.message}`
      });
    }
    next();
  });
};

module.exports = uploadMiddleware;

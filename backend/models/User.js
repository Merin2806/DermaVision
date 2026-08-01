const mongoose = require('mongoose');

const scanSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  condition: {
    type: String,
    required: true
  },
  confidence: {
    type: Number,
    required: true
  },
  severity: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    default: null
  },
  recommendations: [{
    type: String
  }],
  // Extended multi-model pipeline & clinical fields
  description: {
    type: String,
    default: ''
  },
  symptoms: [{
    type: String
  }],
  possibleCauses: [{
    type: String
  }],
  homeCare: [{
    type: String
  }],
  consultDoctor: [{
    type: String
  }],
  treatmentOptions: [{
    type: String
  }],
  affectedArea: {
    type: String,
    default: ''
  },
  segmentationMask: {
    type: String,
    default: null
  },
  bodyPart: {
    type: String,
    default: ''
  },
  gradCamUrl: {
    type: String,
    default: null
  },
  severityScore: {
    type: String,
    default: ''
  },
  similarCases: {
    type: Number,
    default: 0
  },
  averageSeverity: {
    type: String,
    default: ''
  },
  aiModelsUsed: [{
    type: String
  }],
  disclaimer: {
    type: String,
    default: ''
  }
}, { strict: false });

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  scans: [scanSchema],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);

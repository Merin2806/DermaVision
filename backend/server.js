const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorMiddleware');

// Load environment variables
dotenv.config();

// Connect to MongoDB Atlas
connectDB();

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));

// Override express payload limits for image data transfer
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Serve generated PDF reports as static files
const reportsDir = path.join(__dirname, 'reports');
if (!fs.existsSync(reportsDir)) fs.mkdirSync(reportsDir, { recursive: true });
app.use('/reports', express.static(reportsDir));

// Mounting API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api', require('./routes/scanRoutes'));
app.use('/api', require('./routes/recommendationRoutes'));
app.use('/api/report', require('./routes/reportRoutes'));
app.use('/api/history', require('./routes/historyRoutes'));

// Root route
app.get('/', (req, res) => {
  res.send('DermaVision API is running...');
});

// Port fallback configuration
const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server running in development mode on port ${PORT}`);
});

// Global error handler — must be registered LAST, after all routes
app.use(errorHandler);

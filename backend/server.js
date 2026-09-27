require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./src/config/db');
const errorHandler = require('./src/middleware/errorHandler');
const { authMiddleware } = require('./src/middleware/auth');

// Import routes
const authRoutes = require('./src/routes/authRoutes');
const studentRoutes = require('./src/routes/studentRoutes');
const jobRoutes = require('./src/routes/jobRoutes');
const applicationRoutes = require('./src/routes/applicationRoutes');
const atsRoutes = require('./src/routes/atsRoutes');
const experienceRoutes = require('./src/routes/experienceRoutes');
const notificationRoutes = require('./src/routes/notificationRoutes');
const analyticsRoutes = require('./src/routes/analyticsRoutes');

const app = express();
const PORT = process.env.PORT || 8000;

// Connect to MongoDB (local or MongoMemoryServer fallback)
connectDB();

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:8080',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(authMiddleware);

// Health Check Endpoints
const healthPayload = () => ({
  status: 'ok',
  service: 'PlacementPulse REST API Backend',
  timestamp: new Date().toISOString(),
  uptime: process.uptime(),
});

app.get('/api/health', (req, res) => res.json(healthPayload()));
app.get('/health', (req, res) => res.json(healthPayload()));

// API Root info
app.get('/', (req, res) => {
  res.json({
    name: 'PlacementPulse REST API Backend',
    status: 'running',
    version: '1.0.0',
    documentation: 'Virtual Placement Cell Portal API',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      students: '/api/students',
      jobs: '/api/jobs',
      applications: '/api/applications',
      ats: '/api/ats',
      experiences: '/api/experiences',
      notifications: '/api/notifications',
      analytics: '/api/analytics',
    },
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/ats', atsRoutes);
app.use('/api/experiences', experienceRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/analytics', analyticsRoutes);

// Serve frontend static files (for single-service deployment)
const frontendPath = path.join(__dirname, '..', 'frontened');
app.use(express.static(frontendPath));

// SPA fallback — serve index.html for non-API routes
app.get('*', (req, res, next) => {
  if (req.originalUrl.startsWith('/api')) {
    return res.status(404).json({ detail: `Route ${req.originalUrl} not found`, status: 404 });
  }
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// Global Error Handling Middleware
app.use(errorHandler);

if (require.main === module) {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`====================================================`);
    console.log(`🚀 PlacementPulse REST API Server Started!`);
    console.log(`🌐 API Base URL: http://127.0.0.1:${PORT}/api`);
    console.log(`====================================================`);
  });
}

module.exports = app;

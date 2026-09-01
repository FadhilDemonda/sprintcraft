require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const app = express();
const PORT = process.env.PORT || 5000;

// Trust proxy if running behind reverse proxy (Nginx, Netlify, Render)
app.set('trust proxy', 1);

// Security Headers via Helmet (HSTS, CSP, X-Frame-Options, X-Content-Type-Options)
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  contentSecurityPolicy: false // Handled or configured per environment
}));

// CORS with explicit origin allowlist (S6)
const allowedOrigins = (process.env.ALLOWED_ORIGIN || 'http://localhost:5173,http://localhost:3000,https://sprintcraft.ai')
  .split(',')
  .map(o => o.trim());

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// JSON body parsing with strict size limit (100kb to prevent payload DOS)
app.use(express.json({ limit: '100kb' }));

// Health check endpoint for uptime monitoring & load balancers
app.get('/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime(), timestamp: new Date().toISOString() });
});

// Routes
const aiRoutes = require('./routes/ai');
const exportRoutes = require('./routes/export');

app.use('/api/ai', aiRoutes);
app.use('/api/export', exportRoutes);

// Global Error Handler (S7)
app.use((err, req, res, next) => {
  console.error('[SERVER ERROR]', err.message);

  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({ error: 'CORS error: Origin not allowed' });
  }

  // Prevent leaking stack traces or internal details in production
  if (process.env.NODE_ENV === 'production') {
    res.status(500).json({ error: 'Internal Server Error' });
  } else {
    res.status(500).json({ error: err.message, stack: err.stack });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 SprintCraft Server running securely on port ${PORT}`);
});

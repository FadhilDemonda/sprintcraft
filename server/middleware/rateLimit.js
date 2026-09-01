const rateLimit = require('express-rate-limit');

// Rate limiter applied to AI endpoints (S3)
// Key by authenticated uid or fallback to IP
const aiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX || '20', 10), // Limit each user/IP to 20 requests per windowMs
  keyGenerator: (req) => {
    // If the user is authenticated, use their UID as the key.
    // Otherwise, fallback to a static string to avoid IPv6 validation errors from express-rate-limit
    return req.user ? req.user.uid : 'anonymous';
  },
  handler: (req, res, next, options) => {
    res.status(options.statusCode).json({
      error: 'Too Many Requests: You have exceeded your AI decomposition quota. Please try again later.'
    });
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

module.exports = {
  aiRateLimiter,
};

const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

// 1. Rate Limiting: 100 requests per 15 minutes
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: { status: 'fail', error: 'Too many requests from this IP, please try again in 15 minutes.' },
  standardHeaders: true, 
  legacyHeaders: false, 
});

// 2. Helmet (XSS, Clickjacking protection)
const securityHeaders = helmet();

module.exports = {
  apiLimiter,
  securityHeaders
};

const rateLimit = require('express-rate-limit');

const globalLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests, please try again later.' },
});

const otpSendLimiter = rateLimit({
  windowMs: 30 * 1000,
  max: 1,
  keyGenerator: (req) => req.body?.email?.toLowerCase() || req.ip,
  message: { message: 'Please wait 30 seconds before requesting another OTP.' },
  skipFailedRequests: false,
});

module.exports = { globalLimiter, otpSendLimiter };

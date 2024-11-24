const rateLimit = require("express-rate-limit");

const loginLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5, // attempts
  message: {
    message: "Too many login attempts from this IP. Try again after 60 seconds",
  },
  handler: (req, res, next, options) => {
    console.log(req, res);
  },
  standardHeaders: true,
  legacyHeaders: false,
});
module.exports = loginLimiter;

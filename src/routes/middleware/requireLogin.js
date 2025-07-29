// Middleware to make sure user is logged in before accessing certain pages
function requireLogin(req, res, next) {
  if (!req.session.userId) {
    // If user is not logged in, send them to login page
    return res.redirect("/auth/login");
  }
  next(); // If logged in, keep going
}

module.exports = requireLogin; // Export the middleware
module.exports = function requireAuth(req, res, next) {
  // If user is not logged in, remember where they wanted to go
  if (!req.session.user) {
    req.session.returnTo = req.originalUrl;
    return res.redirect("/login");
  }

  return next();
};

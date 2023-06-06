const isAuthenticated = (req, res, next) => {
    // Check if the user is authenticated
    if (req.session.user) {
      next();
    } else {
      res.redirect("/login");
    }
  };
  
  // Use the middleware function
  module.exports = isAuthenticated;

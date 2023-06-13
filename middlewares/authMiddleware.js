const jwt = require("jsonwebtoken");
const secret = "my-secret-key";

const isAuthenticated = (req, res, next) => {
  // Check if the user is authenticated
  const token = req.headers["authorization"];
  if (!token) {
    res.status(401).json("UnAuthorized!");
  }

  jwt.verify(token, secret, (err, user) => {
    if (err) return res.status(401).json(err);
    req.user = user;
    next();
  });
}

// Use the middleware function
module.exports = isAuthenticated;

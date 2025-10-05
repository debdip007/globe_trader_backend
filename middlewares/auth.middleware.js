const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyToken = (req, res, next) => {
  const token = req.headers["x-access-token"] || req.headers["authorization"];
  if (!token) {
    return res.status(401).send({ success: 0, message: "No token provided!" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({ success: 0, message: "Unauthorized!" });
    }
    req.userId = decoded.id;
    next();
  });
};

const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    const userRoles = req.user.roles || [];
    const hasRole = allowedRoles.some(role => userRoles.includes(role));
    if (!hasRole) return res.status(403).json({ message: 'Forbidden' });
    next();
  };
}

module.exports = { verifyToken, authorizeRoles };
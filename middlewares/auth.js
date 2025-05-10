const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "yoursecretkey";

const verifyEmployerToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.employer = decoded; // Attach employer data to request
    next();
  } catch (error) {
    return res.status(401).json({ message: "Logput! Invalid or expired token." });
  }
};

module.exports = verifyEmployerToken;

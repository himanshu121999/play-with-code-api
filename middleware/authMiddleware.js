const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token)
    return res.status(401).json({ error: "Access denied. No token provided." });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.body.student = decoded;
    next();
  } catch (error) {
    res.status(400).json({ error: "Invalid token." });
  }
};

module.exports = protect;

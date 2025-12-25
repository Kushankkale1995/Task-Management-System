const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  console.log("Auth Header:", authHeader);

  if (!authHeader) {
    return res.status(401).json({ message: "Authorization header missing" });
  }

  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return res.status(401).json({ message: "Authorization header malformed" });
  }

  const token = parts[1];
  const trimmedToken =
    typeof token === "string" ? token.trim().replace(/^"|"$/g, "") : token;
  console.log(
    "Token (trimmed):",
    trimmedToken ? `${trimmedToken.slice(0, 8)}...` : trimmedToken
  );

  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error("JWT_SECRET not set");
      return res.status(500).json({ message: "Server misconfiguration" });
    }
    const decoded = jwt.verify(trimmedToken, secret);
    console.log("Decoded token:", decoded);
    // normalize to match controllers expecting `req.user._id`
    req.user = decoded;
    if (decoded.id && !decoded._id) req.user._id = decoded.id;
    next();
  } catch (err) {
    console.log("JWT Error:", err.name, err.message);
    if (err.name === "TokenExpiredError")
      return res.status(401).json({ message: "Token expired" });
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = { verifyToken };

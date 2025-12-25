const jwt = require("jsonwebtoken");

const generateToken = (userId) => {
  const expiresIn = process.env.JWT_EXPIRE || "7d";
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not defined in environment");
  return jwt.sign({ id: userId }, secret, { expiresIn });
};

module.exports = generateToken;

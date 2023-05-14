const jwt = require("jsonwebtoken");

module.exports = accessRequest = (req, res, next) => {
  const bearerToken = req.headers.authorization;
  if (!bearerToken) {
    return res.status(401).json({ message: "Unauthorized access!" });
  }
  const [bearer, token] = bearerToken.split(" ");
  if (bearer !== "Bearer") {
    return res.status(401).json({ message: "Invalid Authorization Token!" });
  }

  jwt.verify(token, "secret", async (err, decoded) => {
    if (err || !decoded) {
      return res.status(100).json({ message: "Authentication Failed" });
    }

    req.currentUser = decoded;
    next();
  });
};

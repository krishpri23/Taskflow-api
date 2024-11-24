const jwt = require("jsonwebtoken");

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const token = authHeader.split(" ")[1];

  //The decoded token contains the payload data that was originally signed (e.g., username, roles, etc.).

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Forbidden" });
    // This is done so that we can check which user has permission to access certain route
    // roles will be attached to every req and when we access a different route we can check the req.roles for permission
    req.user = decoded.UserInfo.username;
    req.roles = decoded.UserInfo.roles;
    next(); // can go to next middleware or routes
  });
};

module.exports = verifyJWT;

const admin = require("../../config/firebaseAdmin");
const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(403).send("A token is required for authentication");
  }
  const token = authHeader.split(" ")[1];
  console.log("Token: " + token);
  try {
    const decodedToken = admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    return res.status(401).send("Invalid Token");
  }
};

module.exports = verifyToken;

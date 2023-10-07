const User = require("../database/models/user");
const admin = require("../config/firebaseAdmin");
exports.vertifyToken = async (token) => {
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    return decodedToken;
  } catch (error) {
    throw new Error("Invalid token with error: " + error);
  }
};

exports.prepareUserData = (decodedToken, additionalInfo) => {
  const userData = {
    firebaseUID: decodedToken.uid,
    additionalData: additionalInfo,
  };
  return userData;
};

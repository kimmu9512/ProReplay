const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const verifyToken = require("../middlewares/auth/vertifyToken");
// unprotected routes (no token needed)
router.post("/register", userController.register_post);
router.post("/register-test", userController.register_test);
router.post("/google-login", userController.google_login);
// protected routes (token needed)
router.post("/subscribe", verifyToken, userController.subscribeSummoner);
router.post("/unsubscribe", verifyToken, userController.unSubscribeSummoner);
router.get(
  "/subscribedList",
  verifyToken,
  userController.getSubscribedSummoners
);
router.get(
  "/isSubscribed/:region/:summonerName",
  verifyToken,
  userController.subscribptionStatus
);
router.get("/displayName", verifyToken, userController.getDisplayName);
router.post("/displayName", verifyToken, userController.setDisplayName);
module.exports = router;

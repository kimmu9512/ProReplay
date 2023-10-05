const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const verifyToken = require("../middlewares/auth/vertifyToken");
// unprotected routes (no token needed)
router.post("/register", userController.register_post);
router.post("/register-test", userController.register_test);

// protected routes (token needed)
router.post("/subscribe", verifyToken, userController.subscribeSummoner);
module.exports = router;
router.post("/unsubscribe", verifyToken, userController.unSubscribeSummoner);
router.get("/subscribe", verifyToken, userController.getSubscribedSummoners);

router.get("/displayName", verifyToken, userController.getDisplayName);
router.post("/displayName", verifyToken, userController.setDisplayName);
module.exports = router;

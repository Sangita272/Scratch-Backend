const express = require("express");
const router = express.Router();

const controller = require("../../controllers/auth.controller");

router.route("/user-login").post(controller.userLogin);
router.route("/verify-token").post( controller.verifyToken);
router.route("/refreshToken").post(controller.refreshToken);
router.route("/signup").post(controller.signup)


module.exports = router;
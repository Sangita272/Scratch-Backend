const express = require("express");
const router = express.Router();

router.use("/", require("./v1/auth.route"));
router.use("/", require("./v1/user.route"));


module.exports = router;

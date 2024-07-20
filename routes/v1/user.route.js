const express = require("express");
const userController = require("../../controllers/user.controller");

const router = express.Router();

router.route("/user/list").get(userController.findAllData);
router.route("/user/details/:id").get(userController.findOneData);
router.route("/user/add").post(userController.addData);
router.route("/user/edit/:id").put(userController.editData);
router.route("/user/delete").patch(userController.remove);
router.route("/user/status-change").put(userController.changeStatus);
module.exports = router;

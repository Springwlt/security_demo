const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user');
const userController = new UserController();

//参考示例
router.post('/userlist', function (req, res, next) {
  userController.getUserList(req, res, next, {});
});

module.exports = router;

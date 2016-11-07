var userController = require('../../db/controllers/userController');

var express = require('express');

var router = express.Router();


// User log in
router.route('/login')
  .post(userController.login);
 

module.exports = router;
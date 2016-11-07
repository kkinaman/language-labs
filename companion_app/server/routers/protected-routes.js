var memoryController = require('../../db/controllers/memoryController');
var express = require('express');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

var router = express.Router();

router.route('/id/:id').get(memoryController.fetchNotes);

module.exports = router;
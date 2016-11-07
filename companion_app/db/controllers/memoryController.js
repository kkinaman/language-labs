// var Memory = require('../models/memoryModel');
// var User = require('../models/userModel');
var collections = require('../config/db');
var _ = require('lodash');

exports.fetchNotes = function(req, res) {
  console.log('GET /api/memories/notes/id/*. username: ', req.params.id);

  var notes = collections.notes.filter(function(note) {
    return _.includes(note, req.params.id);
  });

  if (notes.length === 0) {
    res.status(401).send();
  } else {
    res.status(201).send(notes);
  }

};

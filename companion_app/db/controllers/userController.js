var _ = require('lodash');
var collections = require('../config/db');

// Error messages to log and return as responses
var errNoUsername = 'Username does not exist'; 
var errIncorrectPassword = 'Incorrect password';
var errUsernameTaken = 'Username already taken';

exports.login = function(req, res) {
  console.log('POST /api/users/login. username:', req.body.username);
  var user = collections.users.filter(function(user) {
    return _.includes(user, req.body.username);
  });
  if (user.length === 0) {
    res.status(401).send();
  } else {
    var userProfile = {
      userId: user[0]._id,
      knownLang: user[0].profile.language.toLowerCase(),
      learningLang: user[0].profile.learning.toLowerCase()
    };
    res.status(201).send(userProfile);
  }
};

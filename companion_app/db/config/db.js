// var mongoose = require('mongoose');

// mongoose.connect('mongodb://billzito:Thailand@ds143767.mlab.com:43767/hrmemories-language-labs');

// var db = mongoose.connection;

// db.on('error', console.error.bind(console, 'connection error: '));
// db.once('open', function() {
//   console.log('db is open!');
// });


// module.exports = mongoose;

var MongoClient = require('mongodb').MongoClient;
// var url = 'mongodb://127.0.0.1:3001/meteor';
var url = 'mongodb://billzito:Thailand@ds143767.mlab.com:43767/hrmemories-language-labs';

// Connect using MongoClient
MongoClient.connect(url, function(err, db) {
  // Use the admin database for the operation
  var users = db.collection('users');
  
  users.find({}).toArray(function(err, data) {
    module.exports.users = data;
  });
  
  var notes = db.collection('notes');
  notes.find({}).toArray(function(err, data) {
    module.exports.notes = data;
  });
});

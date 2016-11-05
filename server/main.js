import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import AWS from 'aws-sdk';
AWS.config = new AWS.Config({
});
var s3 = new AWS.S3();
 
export const Notes = new Mongo.Collection('notes');
Meteor.notes = Notes;

export const Videos = new Mongo.Collection('videos');
Meteor.videos = Videos;

import { HTTP } from 'meteor/http';

Meteor.startup(function () {

  Meteor.publish('presences', function() {
    return Presences.find({}, { userId: true });
  });

  Meteor.publish('users', function () {
    return Meteor.users.find({});
  });

  Meteor.publish('notes', function () {
    return Notes.find({}, {userId: true});
  });

  Meteor.publish('videos', function () {
    return Videos.find({}, {userId: true});
  });

  Meteor.methods({
    'updateRating'({newReviews, _id}) {
      Meteor.users.update(_id,
        { $set: { 'reviews': newReviews } 
      });
    },

    'addNote'({text, userId, date, noteType}) {
      Meteor.notes.insert(
        { 
          'text': text, 
          'userId': userId, 
          'title': date, 
          'noteType': noteType
        }
      )
    },

    'updateNote'({noteId, text, userId, date, noteType}) {
      Meteor.notes.update(noteId,
        { 
          'text': text, 
          'userId': userId, 
          'title': date, 
          'noteType': noteType
        }
      )
    },

    'addVideos'({url, userId, date}) {
      Meteor.videos.insert(
        {
          'url': url,
          'userId': userId,
          'date': date
        }
      )
    }
  });

  WebApp.connectHandlers.use("/token", function(req, res, next) {

    HTTP.post('https://api.cognitive.microsoft.com/sts/v1.0/issueToken', 
      {
        headers: {
          'Ocp-Apim-Subscription-Key': '0b2cbbe3d7fc4dcf816e237665026012',
        },
        data: ""
      }, function(err, resp) {
        if (err) console.log(err);
        res.writeHead(200);
        res.end(resp.content);
    });


  });
});


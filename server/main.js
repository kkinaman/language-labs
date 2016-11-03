import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
 
export const Notes = new Mongo.Collection('notes');
Meteor.notes = Notes;

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
    }
  });
});


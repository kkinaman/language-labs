import App                 from '../imports/components/App';
import React               from 'react';
import { render }          from 'react-dom';
import { Meteor }          from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

import '../imports/accountsConfig.js';
import './styles.scss';

import { Mongo } from 'meteor/mongo';
 
export const Notes = new Mongo.Collection('notes');
Meteor.notes = Notes;

export const Videos = new Mongo.Collection('videos');
Meteor.videos = Videos;

/* ------------------------- PEER.JS INIT ------------------------- */
const peer = new Peer({
  key: 'zzak1w02wffuhaor',
  debug: 3,
  config: {'iceServers': [
    { url: 'stun:stun.l.google.com:19302' },
    { url: 'stun:stun1.l.google.com:19302' },
  ]}
});

navigator.getUserMedia =
  navigator.getUserMedia ||
  navigator.webkitGetUserMedia ||
  navigator.mozGetUserMedia ||
  navigator.msGetUserMedia;
/* -------------------------- PEER.JS END -------------------------- */

const AppContainer = createContainer(() => {

  const presencesSub = Meteor.subscribe('presences');
  const usersSub     = Meteor.subscribe('users');
  const notesSub     = Meteor.subscribe('notes');
  const videosSub    = Meteor.subscribe('videos');
  const user         = Meteor.users.findOne(Meteor.userId());
  const userIds      = Meteor.presences.find().map(presence => presence.userId);
  const notes        = Meteor.notes.find();
  const videos       = Meteor.notes.find();
  const loading      = !usersSub.ready() && !presencesSub.ready() && !notesSub.ready();
  
  const onlineUsers  = Meteor.users.find({ 
    $and: [ 
      { _id: { $in: userIds, $ne: Meteor.userId() } }, 
      { 'profile.language': { $exists: true } } 
    ] 
  }).fetch();

  const userNotes  = Meteor.notes.find({
    userId: {$eq: Meteor.userId()}
  }).fetch();

  const userVideos = Meteor.videos.find({
    userId: {$eq: Meteor.userId()}
  }).fetch();

  return {
    onlineUsers,
    user,
    loading,
    peer,
    userNotes,
    userVideos
  };
}, App);


Meteor.startup(() => {
  render(<AppContainer />, document.getElementById('App'));
});

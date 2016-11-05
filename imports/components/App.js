import React          from 'react';
import { Meteor }     from 'meteor/meteor';
import HomePage       from './HomePage';
import SelectLanguage from './SelectLanguage';
import Navigation     from './Navigation';


const validateProfile = (obj, ...args) => {
  for (var i = 0; i < args.length; i++) {
    if (!obj || !obj.hasOwnProperty(args[i])) {
      return false
    }
    obj = obj[args[i]];
  }
  return true;
}


const App = ({
  onlineUsers, 
  user, 
  loading,
  peer,
  userNotes,
  userVideos
}) => {
  if (!loading && user) {
    if (!validateProfile(user, 'profile', 'complete')) {
      return (
        <SelectLanguage id={Meteor.userId()} /> 
      );
    } else {
      return (
        <Navigation 
          onlineUsers={onlineUsers.filter(u => (
            u.profile.language.toLowerCase() === user.profile.learning.toLowerCase() 
            && u.profile.learning.toLowerCase() === user.profile.language.toLowerCase()
          ))}
          language={user.profile.language}
          peer={peer}
          user={user}
          notes={userNotes}
          videos={userVideos}
        />
      );
    }
  } else { return <HomePage /> }
}

export default App;
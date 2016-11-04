import React from 'react';
import { Meteor } from 'meteor/meteor';
import AccountsUIWrapper from './accounts'

const HomePage = () => (

  <div className='home-page'>
    <span className='sign-in'>
      <AccountsUIWrapper />
    </span>
    <div className='main-logo'>
      LANGUAGE LABS
    </div>
  </div>
);

export default HomePage;
import React from 'react';
import UserProfile from './UserProfile';
import NavigationWrapper from './NavigationWrapper';

class ProfilePage extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className='notes-page'>
        <NavigationWrapper returnToNav={ this.props.returnToNav } />
        <UserProfile user={ this.props.user } />
      </div>    
    )
  }
}

export default ProfilePage
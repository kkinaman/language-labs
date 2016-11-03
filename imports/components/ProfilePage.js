import React from 'react';
import NavigationWrapper from './NavigationWrapper';

class ProfilePage extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className='notes-page'>
        <NavigationWrapper returnToNav={ this.props.returnToNav } />
        <h1>Profile</h1>
      </div>    
    )
  }
}

export default ProfilePage
import React from 'react';
import NavigationWrapper from './NavigationWrapper';

class NotesPage extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className='notes-page'>
        <NavigationWrapper returnToNav={ this.props.returnToNav } />
        <h1>Notes</h1>    
      </div>
    )
  }
}

export default NotesPage
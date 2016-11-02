import React from 'react';
import { Meteor } from 'meteor/meteor';
import InlineEdit from 'react-edit-inline';

class Notes extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className="user-profile">
        <textarea className="active-note">
          This is our note editor
        </textarea>
        <div>
          <div className="button-wrapper">
            <button>View all</button>  
          </div>
          <div className="button-wrapper">
            <button>Save</button>  
          </div>
        </div>     
      </div>
    )
  }

}

export default Notes
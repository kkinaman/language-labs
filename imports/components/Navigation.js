import React          from 'react';
import { Meteor }     from 'meteor/meteor';
import Dashboard      from './Dashboard';

class Navigation extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      page: 'nav'
    };
  }





  render() {
    if (this.state.page === 'video') {
      return (
        <Dashboard 
          onlineUsers={this.props.onlineUsers}
          language={this.props.language}
          peer={this.props.peer}
          user={this.props.user}
          notes={this.props.notes}
        />
      )
    } else if (this.state.page === 'notes') {
      return (
        <div>Notes page</div>
      )
    } else if (this.state.page === 'profile') {
      return (
        <div>Profile page</div>
      )
    } else if (this.state.page === 'shop') {
      return (
        <div>Shop page</div>
      )
    } else {
      return (
        <div>Main nav page</div>
        <div>Main nav page</div>
        <div>Main nav page</div>
        <div>Main nav page</div>
        
      )
    }
  }
}

export default Navigation;
import React          from 'react';
import { Meteor }     from 'meteor/meteor';
import Dashboard      from './Dashboard';

class Navigation extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      'page': 'nav'
    };
  }

  handleNavigationClick(page) {
    this.setState({
      'page': page
    });
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
        <div>
          <div onClick={ this.handleNavigationClick.bind(this, 'video') } >Start a conversation with someone</div>
          <div onClick={ this.handleNavigationClick.bind(this, 'profile') } >Edit your profile</div>
          <div onClick={ this.handleNavigationClick.bind(this, 'shop') } >Shop for stuff you might be interested in</div>
          <div onClick={ this.handleNavigationClick.bind(this, 'notes') } >Look at all your notes</div>
        </div>
      )
    }
  }
}

export default Navigation;
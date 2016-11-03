import React          from 'react';
import { Meteor }     from 'meteor/meteor';
import Dashboard      from './Dashboard';
import NotesPage      from './NotesPage';
import ProfilePage    from './ProfilePage';
import ShopPage       from './ShopPage';

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
          returnToNav={ this.handleNavigationClick.bind(this, 'nav') }
        />
      );
    } else if (this.state.page === 'notes') {
      return (
        <NotesPage returnToNav={ this.handleNavigationClick.bind(this, 'nav') } />
      );
    } else if (this.state.page === 'profile') {
      return (
       <ProfilePage returnToNav={ this.handleNavigationClick.bind(this, 'nav') }
        user={ this.props.user }
        />
      );
    } else if (this.state.page === 'shop') {
      return (
        <ShopPage returnToNav={ this.handleNavigationClick.bind(this, 'nav') } />
      );
    } else {
      return (
        <div className='navigation-list'>
          <div onClick={ this.handleNavigationClick.bind(this, 'video') } >Start a conversation</div>
          <div onClick={ this.handleNavigationClick.bind(this, 'profile') } >Edit your profile</div>
          <div onClick={ this.handleNavigationClick.bind(this, 'shop') } >Shop </div>
          <div onClick={ this.handleNavigationClick.bind(this, 'notes') } >View all notes</div>
        </div>
      )
    }
  }
}

export default Navigation;
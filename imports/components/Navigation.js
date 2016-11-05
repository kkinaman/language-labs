import React              from 'react';
import { Meteor }         from 'meteor/meteor';
import Dashboard          from './Dashboard';
import NotesPage          from './NotesPage';
import ProfilePage        from './ProfilePage';
import VideoLogPage       from './VideoLogPage';
import VideoHistoryPage   from './VideoHistoryPage';
import AccountsUIWrapper  from './accounts'

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
        <NotesPage user={this.props.user} notes={this.props.notes} returnToNav={ this.handleNavigationClick.bind(this, 'nav') } />
      );
    } else if (this.state.page === 'profile') {
      return (
       <ProfilePage returnToNav={ this.handleNavigationClick.bind(this, 'nav') }
        user={ this.props.user }
        />
      );
    } else if (this.state.page === 'videoLog') {
      return (
        <VideoLogPage returnToNav={ this.handleNavigationClick.bind(this, 'nav') } />
      );
    } else if (this.state.page === 'videoHistory') {
      return (
        <VideoHistoryPage returnToNav={ this.handleNavigationClick.bind(this, 'nav') } videos={this.props.videos} />
      );
    } else {
      return (
        <div>
          <div className="sign-out">
            <AccountsUIWrapper />
          </div>
          <div className='navigation-list'>
            <div onClick={ this.handleNavigationClick.bind(this, 'video') } >Start a conversation</div>
            <div onClick={ this.handleNavigationClick.bind(this, 'profile') } >Edit your profile</div>
            <div onClick={ this.handleNavigationClick.bind(this, 'notes') } >Review Notes</div>
            <div onClick={ this.handleNavigationClick.bind(this, 'videoLog') } >Video History</div>
            <div onClick={ this.handleNavigationClick.bind(this, 'shop') } >Shop </div>
            <div onClick={ this.handleNavigationClick.bind(this, 'videoHistory') } >Video History </div>
            <div onClick={ this.handleNavigationClick.bind(this, 'notes') } >View all notes</div>
          </div>
        </div>
      )
    }
  }
}

export default Navigation;
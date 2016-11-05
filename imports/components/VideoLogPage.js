import React from 'react';
import NavigationWrapper from './NavigationWrapper';

class VideoLogPage extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className='video-log-page'>
        <NavigationWrapper returnToNav={ this.props.returnToNav } />
        <h1>Video History</h1>    
      </div>
    )
  }
}

export default VideoLogPage;
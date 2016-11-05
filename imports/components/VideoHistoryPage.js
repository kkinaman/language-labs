import React from 'react';
import NavigationWrapper from './NavigationWrapper';

class VideoHistoryPage extends React.Component {
  constructor(props) {
    super(props)
    console.log(props.videos);
  }

  render() {
    return (
      <div className='videoHistory'>
        <NavigationWrapper returnToNav={ this.props.returnToNav } />
        <div className='video-wrapper'>
          <h1>Video History</h1> 
          {
            this.props.videos.map((video) => {
              return (<div><video muted='true' autoPlay='true' src={video.url} className='savedVideo'></video></div>);
            })
          }
        </div>
      </div>    
    )
  }
}

export default VideoHistoryPage
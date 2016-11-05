import React             from 'react';
import { Meteor }        from 'meteor/meteor';
import SelectLanguage    from './SelectLanguage';
import Matches           from './Matches';
import UserProfile       from './UserProfile';
import Clock             from './Clock';
import TopicSuggestion   from './TopicSuggestion';
import Review            from './Review';
import Waiting           from './Waiting';
import Welcome           from './Welcome';
import Notes             from './Notes';
import Transcriber       from './Transcriber';
import NavigationWrapper from './NavigationWrapper';

// initialize AWSbucket with my pwd that should not to server
AWS.config = new AWS.Config({
  accessKeyId: 'AKIAJK4R2PIDJYTBTWFA', secretAccessKey: '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', region: 'us-west-1'
});
var s3 = new AWS.S3();


class Dashboard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      localStream: false,
      currentCall: false,
      callDone: false,
      callLoading: false,
      partner: false,
      mediaRecorder: {},
      fullBlob: ""
    };

    this.startChat.bind(this);
    this.endChat.bind(this);

    this.myVideo;
  }

  startChat(users, peer) {
    // save context
    var allBlobs = [];

    var dashboard = this;

    // get html video elements
    this.myVideo = this.refs.myVideo;
    var myVideo = this.refs.myVideo;
    var theirVideo = this.refs.theirVideo;
    // var recordedVideo = this.refs.recordedVideo;
    
    // get audio/video permissions
    navigator.getUserMedia({ audio: true, video: true }, (stream) => {
      // save your users own feed to state
      dashboard.setState({ localStream: stream });

      // show loading screen
      dashboard.toggleLoading(true);

      // show own videostream of user
      myVideo.src = URL.createObjectURL(stream);

      var options = {mimeType: 'video/webm', bitsPerSecond: 100000};
      var mediaRecorder = new MediaRecorder(stream, options);

      this.setState({mediaRecorder: mediaRecorder});

      // time in start is how often events will be fired
      this.state.mediaRecorder.start(10);

      console.log('Created MediaRecorder', mediaRecorder, 'with options', options);

      this.state.mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          // console.log('blob created', event.data);
          allBlobs.push(event.data);
        }
      }

      // var fullBlob;

      // var renderVideo = () => {
      //   var superBuffer = new Blob(fullBlob, {type: 'video/webm'});
      //   this.refs.myVideo.src = window.URL.createObjectURL(superBuffer);
      // };

      this.state.mediaRecorder.onstop = () => {
        console.log('media recorder closed');
        var fullBlob = new Blob(allBlobs);
        this.setState({fullBlob: fullBlob});
        allBlobs = [];
        console.log('created new blob', fullBlob);
        var params = {ACL: "public-read", Bucket: "invalidmemories", Key: "arealvid" + fullBlob.size, Body: fullBlob};
        // var s3AndCb = (params, cb) => {
        //   s3.upload(params, (err, data) => {
        //     if (err) {
        //       console.log('error creating');
        //       cb(err, null);
        //     } else {
        //       console.log('success uploading', data);
        //       cb(null, data);
        //     }
        //   });
        // };
        // s3AndCb(params, renderVideo);
        // this.myVideo.src = URL.createObjectURL(fullBlob);
        s3.upload(params, (err, data) => {
          if (err) {
            console.log('err uploading ', err);
          } else {
            console.log('success uploading', data);
            // Meteor.call('getVideos');
            // this.refs.myVideo.src = 
            // renderVideo();
          }
        });

        console.log('attempting to render');
        // Meteor.call('getVideos', (err, data) => {
        //   if (err) {
        //     console.log('err received', err);
        //   } else {
        //     console.log('got video', data);
        //     myVideo.src = URL.createObjectURL(fullBlob);
        //   }
        // });
        var getParams = {Bucket: 'invalidmemories', Key: 'arealvid223467'};
        var videoUrl = URL;

        s3.getObject(getParams, (err, data) => {
          if (err) {
            console.log('err getting vid', err);
          } else {
            console.log('got vid', JSON.parse(data.body));
            var SUPERBLOB = new Blob([data.body]);
            this.myVideo.src = videoUrl.createObjectURL(SUPERBLOB);
            // this.renderVideo(data);
          }
        });
      }



      // give the current user a peerId and save their streamId
      Meteor.users.update({_id: Meteor.userId()}, {
        $set: {
          'profile.peerId': peer.id,
          'profile.streamId': stream.id
        }
      });

      // find other person to call
      var user = users[0];

      // setTimeout needed to ensure partner can be found
      setTimeout(function() {
        // receive a call from other person
        if (!dashboard.state.currentCall) {
          peer.on('call', function (incomingCall) {
            dashboard.setState({ currentCall: incomingCall });
            incomingCall.answer(stream);
            incomingCall.on('stream', function (theirStream) {
              dashboard.toggleLoading(false);
              theirVideo.src = URL.createObjectURL(theirStream);
              dashboard.setPartner(theirStream.id);
            });
          });
        }

        // if call not received first, call other person
        if (!dashboard.state.currentCall) {
          var outgoingCall = peer.call(user.profile.peerId, stream);
          dashboard.setState({ currentCall: outgoingCall });
          outgoingCall.on('stream', function (theirStream) {
            dashboard.toggleLoading(false);
            theirVideo.src = URL.createObjectURL(theirStream);
            dashboard.setPartner(theirStream.id);
          });
        }

        // if other person ends chat, end chat too
        dashboard.state.currentCall.on('close', function() {
          dashboard.endChat();
        });
      }, 200);
    }, function (error) { 
      console.log(error); 
    });
  }

  endChat() {
    // close peerjs connection
    this.state.currentCall.close();
 
    // turn off camera and microphone
    this.state.localStream.getTracks().forEach(function(track) {
      track.stop();
    });

    // remove streams from html video elements
    this.refs.myVideo.src = null;
    this.refs.theirVideo.src = null;
    
    this.setState({ 
      currentCall: false,
      callDone: true 
    });
    
    // stop recorder if hasnt already stopped
    this.state.mediaRecorder.stop();
    
  }

  toggleLoading(loading) {
    this.setState({
      callLoading: loading
    });
  }

  setPartner(id) {
    var partner = Meteor.users.findOne({ 'profile.streamId': id });
    if (partner) {
      this.setState({
        partner: partner
      });
    }
  }

  clearPartner () {
    this.setState({
      partner: false,
      callDone: false
    });
  }

  renderVideo(data) {
    // var superBuffer = new Blob(this.state.fullBlob, {type: 'video/webm'});
    console.log('rendered');
    this.myVideo.src = URL.createObjectURL(data);
  }

  // dont forget to add review back in
  render() {
    return (
      <div className='dashboard'>
        <div className='left'>
          <div className='topLeft'>
            <div className='video-box shadowbox'>
              {!this.state.callDone &&
              
                <div className='video-wrapper'>
                  {!this.state.callLoading && !this.state.currentCall &&
                    <Welcome numMatches={this.props.onlineUsers.length}/>
                  }
                  {this.state.callLoading &&
                    <Waiting />
                  }
                  <video ref='myVideo' id='myVideo' muted='true' autoPlay='true' 
                    className={this.state.callLoading} src="https://s3-us-west-1.amazonaws.com/invalidmemories/arealvid208628.webm"></video>
                  <video ref='theirVideo' id='theirVideo' autoPlay='true'
                    className={this.state.callLoading ? 'hidden' : null}></video>
                </div>
              }
            </div>
          </div>
          <div className='bottomLeft shadowbox'>
            <Transcriber user={this.props.user}/>  
          </div>
        </div>
        <div className='right'>
          <div className='topRight shadowbox'>
            <NavigationWrapper returnToNav={ this.props.returnToNav } />
            <Notes notes={this.props.notes} user={this.props.user}/>
          </div>
          <div className='bottomRight shadowbox'>
            <div className='waiting-button-wrapper'>
              {!this.props.onlineUsers[0] &&
                <button>Waiting</button>
              }
              {this.props.onlineUsers[0] && !this.state.currentCall &&
                <button onClick={this.startChat.bind(this, this.props.onlineUsers, this.props.peer)}>
                  Start Chat
                </button>
              }
              {this.state.currentCall &&
                <button onClick={this.endChat.bind(this)}>
                  End Chat
                </button>
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Dashboard;
import React from 'react';
import { Meteor } from 'meteor/meteor';
import Media from '../MediaStreamRecorder';
import { HTTP } from 'meteor/http';

class Transcriber extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      primaryTranscript: '',
      secondaryTranscript: '',
      sourceLang: 'en',
      sourceLangName: "English",
      targetLang: "es",
      targetLangName: "Spanish",
      mediaRecorder: {},
      stream: {},
      ws: {}
    }
  }

  //Open websocket with URL, set appropriate event listeners and feed in data stream
  ConnectWithTranslatorServer(lang1, lang2, accToken) {
    console.debug("Connecting with service...");
    try {
        //Setup connections
        var newRecorder = new Media.mediaMaker(this.state.stream);
        this.setState({mediaRecorder: newRecorder});
        this.state.mediaRecorder.mimeType = 'audio/wav';
        this.state.mediaRecorder.audioChannels = 2;
        console.debug("Created media recorder");
     
        
        var ws_url = "wss://dev.microsofttranslator.com/speech/translate?api-version=1.0&from=" + lang1 + "&to=" + lang2 + "&access_token=" + encodeURIComponent(accToken);
        
        this.setState({ws: new WebSocket(ws_url)});
        console.debug("Created websocket");
        
        this.state.ws.onopen = () => {
            this.state.mediaRecorder.start(200);
            }
        
        this.state.ws.onclose = function (event) {
            console.error('web socket closed' + JSON.stringify(event));
        }
        
        this.state.ws.onerror = function (event) {
            alert('exDescription: Code: ' + event.code + ' Reason: ' + event.reason);
        }
        console.debug("Setup websocket callbacks");
        
        
      } catch (error) {
          console.error("Error when opening session: " + error);
          CloseSession();
      }
  }

  StopSession() {
    this.TerminateConnections(true);
  }

  TerminateConnections(closeStream) {
    
    if (closeStream) {
        if (this.state.stream) {
            this.state.stream = null;
        }
        else
            console.error("this.state.stream not set");
    }
    
    this.state.mediaRecorder ? this.state.mediaRecorder.stop() : console.error("No mediaRecorder");
    
    this.state.ws ? this.state.ws.close() : console.error("No websocket");
    this.state.ws = null;
    
    console.debug("Terminated connections");
  }

  GenerateToken(callbackIfSuccessfulToken) {
      var accToken = "";

      var xhttp = new XMLHttpRequest();
      // *** USE YOUR OWN SERVER TO RETURN A VALID ADM TOKEN ***
      // We suggest using a session cookie for a minimal validation that request for token is coming from your own client app
      // For commercial apps, you may want to protect the call to get a token behind your own user authentication.
      xhttp.open("GET", "https://hrmemories-language-labs.meteorapp.com/token", true);
      
      xhttp.onreadystatechange = function () {
          if (xhttp.readyState == 4 && xhttp.status == 200) {
              accToken = xhttp.responseText;

              console.debug("Token: " + accToken);
              if (typeof callbackIfSuccessfulToken === 'function')
                  callbackIfSuccessfulToken(accToken);
              else
                  console.error("callbackIfSuccessfulToken is not a function");
          }
      }
      
      xhttp.send();
  }

  StartSession() {
    if (navigator.getUserMedia) {
        navigator.getUserMedia({ audio: true }, (streamArg) => {
            console.log(streamArg);
            this.setState({stream: streamArg});
            if (this.state.stream)
            {
                console.debug("Starting session...");

                this.GenerateToken(this.SetupWebConnection.bind(this));
    
            } else {
               console.error("stream is null");
            }
        
        }, function (e) {
            alert('Error capturing audio.');
        });
    } 
    else alert('getUserMedia not supported in this browser.');

  }

  SetupWebConnection(accToken) {
    console.debug("Setting up connection for valid ADM token...");
    this.ConnectWithTranslatorServer(this.state.sourceLang, this.state.targetLang, accToken);
    var firstTranslation = true;
   
    //Handle messages
    this.state.ws.onmessage = (event) => {
        console.debug('received event from socket.');
        var response = JSON.parse(event.data);
        console.debug(response.recognition);
        
        if (firstTranslation) {
            firstTranslation = false;
        }
    
            this.setState({primaryTranscript: response.recognition, secondaryTranscript: response.translation});
            this.render();
    }
    
    this.state.mediaRecorder.ondataavailable = (blob) => {
      console.log('data available, sending blob');
      if (this.state.ws)
          this.state.ws.send(blob);
    };
  }

  convertToArray(langArray) {
    var arr = Object.keys(langArray).map(function (k) { let obj = langArray[k]; obj.key = k; return obj; });
    return arr;
  }

  findMatch(userLang, langArray) {
    for (var i = 0; i < langArray.length; i++) {
        if (userLang == langArray[i].key.substring(0, 2)) {
            return langArray[i];
        }
    }
    return false;
  }

//This function is called on page load
//The purpose of this function is to enumerate all speech recognition and translation languages
  getLang() {
    var langURL = "https://dev.microsofttranslator.com/languages?scope=speech,text&api-version=1.0";
    
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = () => {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            var results = JSON.parse(xmlhttp.responseText);
            var sourceLangArray = convertToArray(results.speech);
            var targetLangArray = convertToArray(results.text);
            var userLang = (navigator.language).substring(0, 2);
            var match1 = findMatch(userLang, sourceLangArray);
            if (match1) {
                this.state.sourceLang = match1.key;
                this.state.sourceLangName = match1.name;
            }
            var match2 = findMatch(userLang, targetLangArray);
            if (match2) {
                this.state.targetLang = match2.key;
                this.state.targetLangName = match2.name;
            }
            
            //save the languages
            chrome.storage.local.set({ 'sourceLanguage': this.state.sourceLang, 'targetLanguage': this.state.targetLang, 'sourceLanguageName': this.state.sourceLangName, 'targetLanguageName': this.state.targetLangName }, function () {
                if (chrome.runtime.lastError) {
                    Logger.error("Failed to save the selected options at runtime", chrome.runtime.lastError);
                }
            });
            console.log({ 'sourceLanguage': this.state.sourceLang, 'targetLanguage': this.state.targetLang, 'sourceLanguageName': this.state.sourceLangName, 'targetLanguageName': this.state.targetLangName });
        }
    }
    xmlhttp.open("GET", langURL, true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send();
  }

  saveNote() {
    var sourceLang = this.state.sourceLangName.toLowerCase();
    var targetLang = this.state.targetLangName.toLowerCase();
    var text = {};
    text[sourceLang] = this.state.primaryTranscript;
    text[targetLang] = this.state.secondaryTranscript;
    Meteor.call('addNote', {
      'text': text,
      'userId': Meteor.userId(),
      'date': new Date().toString().slice(0, 24),
      'noteType': 'flashcard'
    }, (err, res) => {
      if (err) { 
        console.log('error saving note to db:', err);
      }
        console.log('saving note:', res);
    });
  }

  render() {
    return (
      <div>
        <button onClick={this.StartSession.bind(this)}>Start</button>
        <button onClick={this.StopSession.bind(this)}>Stop</button>
        <button onClick={this.saveNote.bind(this)}>Save</button>
        <div className='output'>{this.state.primaryTranscript}</div>
        <div className='output'>{this.state.secondaryTranscript}</div>

      </div>
    )
  }
}

export default Transcriber;


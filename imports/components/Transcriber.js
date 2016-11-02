import React from 'react';
import { Meteor } from 'meteor/meteor';
import MediaStreamRecorder from '../MediaStreamRecorder';

class Transcriber extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      results: ''
    }
  }
  render() {
    return (
      <div>
        <button onClick={() => StartSession()}>Start</button>
        <button onClick={() => StopSession()}>Stop</button>
        <div className='output'></div>
      </div>
    )
  }
}

export default Transcriber;

//Set default settings
var sourceLang = "en";
var sourceLangName = "English";
var targetLang = "es";
var targetLangName = "Spanish";
var profanity = "NoAction";
var textSize = "small";

var activeTabId = "";

var _errFunction = console.error;

//State variables
var INITIAL_VALUE = -1;
var ongoingsubtitling = false;

//Connection variables
var mediaRecorder = null;
var stream = null;
var ws = null;

// feature detection 
if (!navigator.getUserMedia)
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia ||
                  navigator.mozGetUserMedia || navigator.msGetUserMedia;


//Open websocket with URL, set appropriate event listeners and feed in data stream
function ConnectWithTranslatorServer(lang1, lang2, accToken) {
    console.debug("Connecting with service...");
    
    try {
        
        //Setup connections
        mediaRecorder = new MediaStreamRecorder(stream);
        mediaRecorder.mimeType = 'audio/wav';
        mediaRecorder.audioChannels = 2;
        console.debug("Created media recorder");
     
        
        var ws_url = "wss://dev.microsofttranslator.com/speech/translate?api-version=1.0&from=" + lang1 + "&to=" + lang2 + '&profanityaction=' + profanity + "&access_token=" + encodeURIComponent(accToken);
        
        ws = new WebSocket(ws_url);
        console.debug("Created websocket");
        
        ws.onopen = function () {
            mediaRecorder.start(200);
            }
        
        ws.onclose = function (event) {
            console.error('web socket closed' + JSON.stringify(event));
        }
        
        ws.onerror = function (event) {
            alert('exDescription: Code: ' + event.code + ' Reason: ' + event.reason);
            displayError(5);
        }
        console.debug("Setup websocket callbacks");
        
        
    } catch (error) {
        console.error("Error when opening session: " + error);
        CloseSession();
    }
}

//Clean up session in terms of UI, state and connections
function StopSession() {
    TerminateConnections(true);
}

function TerminateConnections(closeStream) {
    
    if (closeStream) {
        if (stream) {
            stream = null;
        }
        else
            console.error("Stream not set");
    }
    
    mediaRecorder ? mediaRecorder.stop() : console.error("No mediaRecorder");
    
    ws ? ws.close() : console.error("No websocket");
    ws = null;
    
    console.debug("Terminated connections");
}



function StartSession() {
    
    if (navigator.getUserMedia) {
        navigator.getUserMedia({ audio: true }, function (streamArg) {
            
            stream = streamArg;
            if (stream)
            {
                console.debug("Starting session...");
                //Update state
                ongoingsubtitling = true;
                // GenerateToken(SetupWebConnection);
                //TOKEN GOES HERE
                SetupWebConnection('eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzY29wZSI6Imh0dHBzOi8vZGV2Lm1pY3Jvc29mdHRyYW5zbGF0b3IuY29tLyIsInN1YnNjcmlwdGlvbi1pZCI6IjIyODMzNmZiMmFiODQ4ZTdhYjBhNzM2YThmOGJjMGRhIiwicHJvZHVjdC1pZCI6IlNwZWVjaFRyYW5zbGF0b3IuRjAiLCJjb2duaXRpdmUtc2VydmljZXMtZW5kcG9pbnQiOiJodHRwczovL2FwaS5jb2duaXRpdmUubWljcm9zb2Z0LmNvbS9pbnRlcm5hbC92MS4wLyIsImF6dXJlLXJlc291cmNlLWlkIjoiL3N1YnNjcmlwdGlvbnMvZDc4MjEwOTgtMDk5Yy00OTExLTk5OTItNGY3YWM1OTYyOGMyL3Jlc291cmNlR3JvdXBzL2xhbmd1YWdlLWxhYnMvcHJvdmlkZXJzL01pY3Jvc29mdC5Db2duaXRpdmVTZXJ2aWNlcy9hY2NvdW50cy9pbnZhbGlkLW1lbW9yaWVzIiwiaXNzIjoidXJuOm1zLmNvZ25pdGl2ZXNlcnZpY2VzIiwiYXVkIjoidXJuOm1zLm1pY3Jvc29mdHRyYW5zbGF0b3IiLCJleHAiOjE0NzgxMDYyMTl9._zgKKabO0K6xbbvdEwR4CerIelQL9QxErmDN4HnQs6Y');
    
            } else {
               console.error("stream is null");
               displayError(8);
            }
        
        }, function (e) {
            alert('Error capturing audio.');
        });
    } 
    else alert('getUserMedia not supported in this browser.');

}

// REMEMBER: register with ADM and enter your client ID and secret here.
// This code should always be run on the server, never on the client, so the secret is not exposed to app users
// function getAdmToken(){
//     var post_data = querystring.stringify({
//         'client_id': 'invalid-memories', //your client id,
//         'scope': 'http://api.microsofttranslator.com',
//         'grant_type': 'client_credentials',
//         'client_secret': '5Bpf0b5tDzFUGiFNL8lyLJjEyQKUvN2pQo2j8piaxvo=' // your client secret
//     });
    
//     var post_options = {
//         host: 'datamarket.accesscontrol.windows.net',
//         path: '/v2/OAuth2-13',
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/x-www-form-urlencoded',
//             'Content-Length': Buffer.byteLength(post_data)
//         }
//     };
    
    
//     var post_req = https.request(post_options, function (res) {
//         res.setEncoding('utf8');
//         if (res.statusCode == 200) {
//             res.on('data', function (chunk) {
//                 accToken = JSON.parse(chunk).access_token;
//                 //log('[generateAdmToken] Success');
//             });
//         }
//         else {
//             accToken = ERR_REQ_FAIL;
//             //log('[generateAdmToken] Failed with status code ' + res.statusCode, "error");
//         }
//     });
    
//     post_req.write(post_data);
//     post_req.end();

// }

// function GenerateToken(callbackIfSuccessfulToken) {
//     var accToken = "";

//     var xhttp = new XMLHttpRequest();
//     // *** USE YOUR OWN SERVER TO RETURN A VALID ADM TOKEN ***
//     // We suggest using a session cookie for a minimal validation that request for token is coming from your own client app
//     // For commercial apps, you may want to protect the call to get a token behind your own user authentication.
//     // xhttp.open("GET", "http://localhost:3000/token", true);
//     xhttp.open('GET', 'https://api.cognitive.microsoft.com/sts/v1.0/issueToken', true);
    
//     xhttp.onreadystatechange = function () {
//         if (xhttp.readyState == 4 && xhttp.status == 200) {
//             accToken = xhttp.responseText;

//             console.debug("Token: " + accToken);
//             if (typeof callbackIfSuccessfulToken === 'function')
//                 callbackIfSuccessfulToken(accToken);
//             else
//                 console.error("callbackIfSuccessfulToken is not a function");
//         }
//     }
    
//     xhttp.send();

// }

function SetupWebConnection(accToken) {
    console.debug("Setting up connection for valid ADM token...");
    ConnectWithTranslatorServer(sourceLang, targetLang, accToken);
    var firstTranslation = true;
   
    //Handle messages
    ws.onmessage = function (event) {
        console.debug('received event from socket.');
        var response = JSON.parse(event.data);
        console.debug(response.recognition);
        
        if (firstTranslation) {
            firstTranslation = false;
        }
    
            var elem = document.createTextNode(response.recognition + '(' + response.translation + ')');
            var hr = document.createElement('hr');
            var parent = document.getElementById("output");
            parent.appendChild(hr);
            parent.appendChild(elem);
    }
    
    mediaRecorder.ondataavailable = function (blob) {
        if (ws)
            ws.send(blob);
    };
}



function convertToArray(langArray) {
    var arr = Object.keys(langArray).map(function (k) { let obj = langArray[k]; obj.key = k; return obj; });
    return arr;
}

function findMatch(userLang, langArray) {
    for (var i = 0; i < langArray.length; i++) {
        if (userLang == langArray[i].key.substring(0, 2)) {
            return langArray[i];
        }
    }
    return false;
}

//This function is called on page load
//The purpose of this function is to enumerate all speech recognition and translation languages
function getLang() {
    var langURL = "https://dev.microsofttranslator.com/languages?scope=speech,text&api-version=1.0";
    
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            var results = JSON.parse(xmlhttp.responseText);
            var sourceLangArray = convertToArray(results.speech);
            var targetLangArray = convertToArray(results.text);
            var userLang = (navigator.language).substring(0, 2);
            var match1 = findMatch(userLang, sourceLangArray);
            if (match1) {
                sourceLang = match1.key;
                sourceLangName = match1.name;
            }
            var match2 = findMatch(userLang, targetLangArray);
            if (match2) {
                targetLang = match2.key;
                targetLangName = match2.name;
            }
            
            //save the languages
            chrome.storage.local.set({ 'sourceLanguage': sourceLang, 'targetLanguage': targetLang, 'sourceLanguageName': sourceLangName, 'targetLanguageName': targetLangName }, function () {
                if (chrome.runtime.lastError) {
                    Logger.error("Failed to save the selected options at runtime", chrome.runtime.lastError);
                }
            });
            console.log({ 'sourceLanguage': sourceLang, 'targetLanguage': targetLang, 'sourceLanguageName': sourceLangName, 'targetLanguageName': targetLangName });
        }
    }
    xmlhttp.open("GET", langURL, true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send();
}


//The purpose of this function is to display an error to the user based on the scenario
function displayError(errorCode) {
    
    var messageText = "";
    var messageString = "";
    var debuggingString = "";
    var icon = "";
    
    switch (errorCode) {
        case 1: {
            messageText = "Listening";
            messageString = "Streaming audio and waiting for subtitles.";
            icon = "listen";
            break;
        }
        case 5: {
            messageText = "Oops";
            messageString = "The subtitling service is temporarily unavailable. Please try again later.";
            icon = "error";
            break;
        }
       
        case 9: {
            messageText = "Oops";
            messageString = "Looks like the service is overloaded. Please try again later.";
            icon = "error";
            break;
        }
        case 10: {
            messageText = "Oops";
            messageString = "The subtitling service is temporarily unavailable. Please try again later.";
            debuggingString = "Azure service didn't give us a token";
            icon = "error";
            break;
        }
        
        default: {
            messageText = "Oops...";
            messageString = "Something went wrong. Please try later.";
            icon = "error";
            break;
        }
       
    }
    
    console.error(debuggingString, messageText, messageString);
    
}

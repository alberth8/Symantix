import React from 'react';
import ReactDom from 'react-dom';
import { browserHistory } from 'react-router';
import $ from 'jquery';

import FACE from './../../lib/FACE-1.0.js';
import env from './../../../env/client-config.js';
import RecordInstructions from './record-instructions.jsx';
import RecordQuestions from './record-questions.jsx';

//var x = 0;

export default class RecordView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sessionId: null,
      intervalId: null,
      showQuestions: false,
      startTime: undefined,
      payed: false
    }
  }

  componentDidMount() {
    FACE.webcam.startPlaying('webcam');
    
    $.ajax({
      type: 'GET',
      url: '/api/users',
      success: function(user) {
        //console.log('THE AJAX SUCCESS: ', user);
        if (user.payed === 1) {
          this.setState({payed: true});
        } 

      }.bind(this),
      
      error: function(error) {
        console.error('User Not Found:', error)
      }
    });
    
  }

  _createNewSession(e) {
    var formData = {
     title: $('.record-title')[0].value,
     subject: $('.record-subject')[0].value,
     description: $('.record-description')[0].value
    }

    $.ajax({
      type: 'POST',
      url: '/api/session',
      data: formData,
      success: function(newSession) {
        console.log('New Session: ' + newSession.id);
        this.setState({
          sessionId: newSession.id
        });

        this._startRecording()
        this._loadprompt()
      }.bind(this),
      error: function(error) {
        console.error('startRecording error', error)
      },
      dataType: 'json'
    });
  }
  _loadprompt() {

    $('.record-instructions').remove()
    this.setState({showQuestions: true})


  }
  _startRecording() {
    var intervalId = setInterval(function() {
      FACE.webcam.takePicture('webcam', 'current-snapshot');
      this._takeSnapshot();
    }.bind(this), 1000);

    this.setState({ intervalId: intervalId, startTime: Date.now() });
  }

  _takeSnapshot() {
    var snapshot = document.querySelector('#current-snapshot');
    if( snapshot.naturalWidth == 0 ||  snapshot.naturalHeight == 0 ) return;

    // Process snapshot and make API call
    var snapshotBlob = FACE.util.dataURItoBlob(snapshot.src);
    var successCb = function(data) {
      // console.log(snapshotData.persons[0]);
      this._createNewSnapshot(data.persons[0])
    }.bind(this);
    var errorCb = function(err) {
      console.error('_sendSnapshot error', err);
    }

    FACE.sendImage(
      snapshotBlob,
      successCb, errorCb,
      env.FACE_APP_KEY, env.FACE_CLIENT_ID
    );
  }

  _createNewSnapshot(snapshotData) {
    let sessionId = this.state.sessionId;

    $.ajax({
      method: 'POST',
      url: '/api/snapshot',
      data: {
        sessionId: sessionId,
        snapshotData: snapshotData
      },
      success: function(newSnapshot) {
        console.log('New snapshot created.', newSnapshot);
      },
      error: function(error) {
        console.error('_createNewSnapshot error', error);
      },
      dataType: 'json'
    });
  }

  _submitText(textData) {
<<<<<<< HEAD
=======
    var formData = {
     'textData': textData,
     'sessionId': this.state.sessionId
    }
>>>>>>> 6e91a03d68c012a1d6984ae26e44813cd6e8e772
    // send value from textbox under transcript
    $.ajax({
      type: 'POST',
      url: '/api/text',
<<<<<<< HEAD
      data: {'textData': textData},
=======
      data: formData,
>>>>>>> 6e91a03d68c012a1d6984ae26e44813cd6e8e772
      success: function(data) {
        console.log('textdata: ', data);
      }.bind(this),
      error: function(error) {
<<<<<<< HEAD
        console.error('startRecording error', error)
=======
        console.error('testData error', error)
>>>>>>> 6e91a03d68c012a1d6984ae26e44813cd6e8e772
      },
      dataType: 'json'
    });
  }

  _endSession(e) {
    clearInterval(this.state.intervalId);
    this._calcDuration()

    this._submitText(e.target.textarea.value)

    // Wait 2 seconds after stop button is pressed
    setTimeout(function() {
      FACE.webcam.stopPlaying('webcam');
      if (this.state.payed) {
        browserHistory.push('/reports/' + this.state.sessionId.toString());
      } else {
       browserHistory.push('/payment');
      }
    }.bind(this), 1000)
  }

  _calcDuration () {
    let sessionId = this.state.sessionId;

    if (this.state.startTime !== undefined) {
        var endTime = Date.now();
        var difference = endTime - this.state.startTime;
        difference = Math.round(difference/1000)
    }
    console.log(difference, 'this is the difference in seconds')
    //create ajax request to update /api/sessions of sessionId
    $.ajax({
      type: 'POST',
      url: '/api/session/update',
      data: {
        difference: difference,
        sessionId: sessionId
      },
      success: function(updatedSession) {
        console.log(updatedSession, 'UPDATED DURATION')
      }.bind(this),
      error: function(error) {
        console.error('_calcDuration error', error)
      },
      dataType: 'json'
    });

  }

  render() {
    return (
      <div className="pure-g record-container">
        <div className="pure-u-2-3 record-box">
          <video id='webcam' className="pure-u-1-1 record-webcam" autoplay></video>
          <img id='current-snapshot' src=''/>

        </div>
        <div className="pure-u-1-3 record-form">
          <RecordInstructions clicked={this._createNewSession.bind(this)}/>
          { this.state.showQuestions ? <RecordQuestions clicked={this._endSession.bind(this)}/> : null }
        </div>

      </div>
    )
  }
}

// <div className="pure-u-2-3 record-box">
//           <img className='pure-u-1-2' id='current-snapshot' src=''/>
//         </div>


// $.ajax({
//         type: 'GET',
//         url: '/api/users',
//         success: function(user) {
//           // check if user has payed
//           console.log('SUCCESS: ', user);
//           if (user.payed === 1) {
//             browserHistory.push('/reports/' + this.state.sessionId.toString());
//           } else {
//             browserHistory.push('/payment');
//           }
//         }.bind(this),
//         error: function(error) {
//           console.error('User Not Found:', error)
//         },
//         dataType: 'json'
//       });
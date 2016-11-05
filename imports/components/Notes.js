import React from 'react';
import { Meteor } from 'meteor/meteor';
import InlineEdit from 'react-edit-inline';
import _ from 'lodash';

class Notes extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      'noteType': 'flashcard',
      'nativeText': '',
      'learningText': ''
    }
  }

  viewFlashcards(event) {
    this.setState({
      'noteType': 'flashcard'
    });
    $(event.currentTarget).closest('.button-wrapper')[0].childNodes.forEach(button => $(button).removeClass('selected'));
    $(event.currentTarget).addClass('selected');
  }

  viewNotes(event) {
    this.setState({
      'noteType': 'freeForm'
    });
    $(event.currentTarget).closest('.button-wrapper')[0].childNodes.forEach(button => $(button).removeClass('selected'));
    $(event.currentTarget).addClass('selected');
  }

  saveNote() {
    if (this.state.noteType === 'freeForm') {
      var text = document.getElementById('note').value;
      if (text.length) {
        document.getElementById('note').value = '';

        Meteor.call('addNote', {
          'text': text,
          'userId': Meteor.userId(),
          'date': new Date().toString().slice(0, 24),
          'noteType': 'freeForm'
        }, 
        (err, res) => {
          if (err) { 
            return console.log('error saving note to db:', err);
          }
        });
      }
    } else {
      var sourceLang = this.props.user.profile.language.toLowerCase();
      var targetLang = this.props.user.profile.learning.toLowerCase();

      var text = {};
      text[sourceLang] = this.state.nativeText;
      text[targetLang] = this.state.learningText;

      this.setState({
        nativeText: '',
        learningText: ''
      });


      Meteor.call('addNote', {
        'text': text,
        'userId': Meteor.userId(),
        'date': new Date().toString().slice(0, 24),
        'noteType': 'flashcard'
      }, 
      (err, res) => {
        if (err) { 
          console.log('error saving note to db:', err); 
        }
      });
    }
  }

  nativeTextChanged(event) {
    this.setState({nativeText: event.target.value});
  }

  learningTextChanged(event) {
    this.setState({learningText: event.target.value});
  }

  render() {
    
    return (
      <div className="notes-container">
      {
        this.state.noteType === 'freeForm' ?
          <div className='notes'>
            <div className='saved-notes'>
              <NotesList notes={this.props.notes} />
            </div>
            <textarea id='note' className="new-note" placeholder="Type a note here">
            </textarea>
          </div>
        :
          <div className='notes'>
            <div className='saved-notes'>
              <FlashcardsList notes={this.props.notes} user={this.props.user}/>
            </div>
            <form>
              <label >Add a flashcard</label><br/>
              <div className='inputs'>
                <input placeholder={_.capitalize(this.props.user.profile.language)} 
                        value={this.state.nativeText} 
                        onChange={this.nativeTextChanged.bind(this)}/>
                <input placeholder={_.capitalize(this.props.user.profile.learning)} 
                        value={this.state.learningText}
                        onChange={this.learningTextChanged.bind(this)}/>
              </div>
            </form>
          </div>
      }
        <div className='notes-buttons'>
          <div className="button-wrapper floatLeft">
            <button className='selected' id='flashcards' onClick={this.viewFlashcards.bind(this)}>Flashcards</button>
            <button onClick={this.viewNotes.bind(this)}>Notes</button>
          </div>
          <div className="button-wrapper floatRight">
            <button id='save' onClick={this.saveNote.bind(this)}>Save</button>
          </div>
        </div>
      </div>
    )
  }

}

class NotesList extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
      {
        this.props.notes.map(note => {
          if (note.noteType === 'freeForm') {
            return (
              <div className='note'>
                <text>{note.text}</text>
              </div>
            )
          }
        })
      }
      </div>
    );
  }
}

class FlashcardsList extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <table>
        <thead>
          <tr>
            <th>{_.capitalize(this.props.user.profile.language)}</th>
            <th>{_.capitalize(this.props.user.profile.learning)}</th>
          </tr>
        </thead>
        <tbody>
          {
            this.props.notes.map(note => {
              if (note.noteType === 'flashcard' && 
                Object.keys(note.text).indexOf(this.props.user.profile.language.toLowerCase()) !== -1 &&
                Object.keys(note.text).indexOf(this.props.user.profile.learning.toLowerCase()) !== -1) {
                return (
                  <tr>
                    <td><text>{note.text[this.props.user.profile.language.toLowerCase()]}</text></td>
                    <td><text>{note.text[this.props.user.profile.learning.toLowerCase()]}</text></td>
                  </tr>
                )
              }
            })
          }
        </tbody>
      </table>    
    )
  }
}

export default Notes;
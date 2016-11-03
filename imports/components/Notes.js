import React from 'react';
import { Meteor } from 'meteor/meteor';
import InlineEdit from 'react-edit-inline';

class Notes extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      'noteType': 'freeForm',
      // 'curNote': ''
      // newNote: ''
    }
  }

  // displayNote(note) {
  //   this.setState({
  //     'noteType': note.noteType,
  //     'curNote': note
  //   });
  // }

  viewFlashcards() {

  }

  viewNotes() {

  }

  // newNote() {
  //   this.setState({
  //     'noteType': 'freeForm',
  //     // 'curNote': ''
  //   })
  //   document.getElementById('note').value = '';
  // }

  saveNote() {
    if (this.state.noteType === 'freeForm') {
      // if (this.state.curNote === '') {
        var text = document.getElementById('note').value;
        document.getElementById('note').value = '';

        Meteor.call('addNote', {
          'text': text,
          'userId': Meteor.userId(),
          'date': new Date().toString().slice(0, 24),
          'noteType': 'freeForm'
        }, 
        (err, res) => {
          // console.log('saving note:', res);
          if (err) { 
            return console.log('error saving note to db:', err);
          }
        });

      // } else {
      //   var text = document.getElementById('note').value;

      //   Meteor.call('updateNote', {
      //     'text': text,
      //     'userId': Meteor.userId(),
      //     'date': new Date().toString().slice(0, 24),
      //     'noteType': 'freeForm',
      //     'noteId': this.state.curNote._id
      //   }, 
      //   (err, res) => {
      //     console.log('saving note:', res);
      //     if (err) { 
      //       return console.log('error saving note to db:', err);
      //     }
      //   });
      // }

    } else {
      var firstLang = this.props.user.profile.language.toLowerCase();
      var secondLang = this.props.user.profile.learning.toLowerCase();
      var firstLangText = document.getElementById('first-lang-text').value;
      var secondLangText = document.getElementById('second-lang-text').value;

      var text = {};
      text[firstLang] = firstLangText;
      text[secondLang] = secondLangText;

      Meteor.call('updateNote', {
        'text': text,
        'userId': Meteor.userId(),
        'date': new Date().toString().slice(0, 24),
        'noteType': 'flashcard'
        // 'noteId': this.curNote._id
      }, 
      (err, res) => {
        // console.log('saving note:', res);
        if (err) { 
          return console.log('error saving note to db:', err); 
        }
      });
    }
  }

  render() {
    
    return (
      <div className="notes">
        <div className='saved-notes'>
          <NotesList notes={this.props.notes} />
        </div>
        {
          this.state.noteType === 'freeForm' ?
            <textarea id='note' className="new-note" placeholder="Type a note here">
            </textarea>
          :
            <Flashcard user={this.props.user}/>
        }
        <div className='notes-buttons'>
          <div className="button-wrapper">
            <button onClick={this.viewFlashcards.bind(this)}>Vocab</button>
            <button onClick={this.viewNotes.bind(this)}>Notes</button>
            <button onClick={this.saveNote.bind(this)}>Save</button>
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
        this.props.notes.map(note => (

          <div className='note'>
            <text>{note.text}</text>
          </div>
        ))
      }
      </div>
    );
  }
}

class Flashcard extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className='flashcard-container' style={{display: 'flex'}}>
        <div className='first-language-container'>
          <div className='language'>
            <text>{this.props.user.profile.language}</text>
          </div>
          <div className='text'>
            <textarea id='first-lang-text' rows='20' type="text" defaultValue={this.props.note.text[this.props.user.profile.language]}></textarea>
          </div>
        </div>

        <div className='second-language-container'>
          <div className='language'>
            <text>{this.props.user.profile.learning}</text>
          </div>
          <div className='text'>
            <textarea id='second-lang-text' rows='20' type="text" defaultValue={this.props.note.text[this.props.user.profile.learning]}></textarea>
          </div>
        </div>
      </div>
    )
  }
}

export default Notes;
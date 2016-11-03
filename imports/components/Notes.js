import React from 'react';
import { Meteor } from 'meteor/meteor';
import InlineEdit from 'react-edit-inline';

class Notes extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      'viewAll': false,
      'noteType': 'freeForm',
      'currNote': ''
    }
  }

  viewNotes() {
    this.setState({'viewAll': true});
  }

  displayNote(note) {
    this.setState({
      'viewAll': false,
      'noteType': note.noteType,
      'currNote': note
    });
     
  }

  newNote() {
    this.setState({
      'noteType': 'freeForm',
      'currNote': '',
      'viewAll': false
    })
    document.getElementById('note').value = '';
  }

  saveNote() {
    if (this.state.noteType === 'freeForm') {
      if (this.state.currNote === '') {
        var text = document.getElementById('note').value;

        Meteor.call('addNote', {
          'text': text,
          'userId': Meteor.userId(),
          'date': new Date().toString().slice(0, 24),
          'noteType': 'freeForm'
        }, 
        (err, res) => {
          if (err) { 
            console.log('saving note:', res);
            return console.log('error saving note to db:', err);
          }
        });

      } else {
        var text = document.getElementById('note').value;

        Meteor.call('updateNote', {
          'text': text,
          'userId': Meteor.userId(),
          'date': new Date().toString().slice(0, 24),
          'noteType': 'freeForm',
          'noteId': this.state.currNote._id
        }, 
        (err, res) => {
          if (err) { 
            console.log('saving note:', res);
            return console.log('error saving note to db:', err);
          }
        });
      }

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
        'noteType': 'flashcard',
        'noteId': this.currNote._id
      }, 
      (err, res) => {
        if (err) { 
          console.log('saving note:', res);
          return console.log('error saving note to db:', err); 
        }
      });
    }
  }

  render() {
    
    return (
      <div className="user-profile">
        {
          this.state.viewAll ?
            <NotesList notes={this.props.notes} displayNote={this.displayNote.bind(this)}/>
          :
          this.state.noteType === 'freeForm' ?
            <textarea id='note' className="active-note" placeholder="Type your notes here" defaultValue={this.state.currNote.text}>
            </textarea>
          :
            <Flashcard note={this.state.currNote} user={this.props.user}/>
        }
        <div>
          <div className="button-wrapper">
            <button onClick={this.viewNotes.bind(this)}>View all</button>
          </div>
          <div className="button-wrapper">
            <button onClick={this.saveNote.bind(this)}>Save</button>
          </div>
          <div className="button-wrapper">
            <button onClick={this.newNote.bind(this)}>New</button>
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
          <div>
            <text onClick={this.props.displayNote.bind(null, note)}>{note.title}</text>
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
import React from 'react';
import { Meteor } from 'meteor/meteor';
import InlineEdit from 'react-edit-inline';

class Notes extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      'viewAll': false,
      'noteType': 'freeForm',
      'currNote': {}
    }
  }

  viewNotes() {
    this.setState({'viewAll': true});
  }

  displayNote(note) {
    this.setState({
      'viewAll': false, 
      'noteType': note.noteType, 
      currNote: note
    });
  }

  saveNote() {
    if (this.state.currNote.noteType === 'freeForm') {
      var text = document.getElementById('note').value;

      Meteor.call('addNote', {
        'text': text,
        '_id': Meteor.userId(),
        'date': new Date().toString().slice(0, 24),
        'noteType': 'freeForm'
      }, 
      (err, res) => {
        if (err) { 
          console.log('saving note:', res);
          return console.log('error saving note to db:', err); 
        }
      });

      document.getElementById('note').value = '';

    } else {
      var firstLang = this.props.user.profile.language;
      var secondLang = this.props.user.profile.learning;
      var firstLangText = document.getElementById('first-lang-text').value;
      var secondLangText = document.getElementById('second-lang-text').value;

      var text = {};
      text[firstLang] = firstLangText;
      text[secondLang] = secondLangText;
      console.log(text)

      Meteor.call('addNote', {
        'text': text,
        '_id': Meteor.userId(),
        'date': new Date().toString().slice(0, 24),
        'noteType': 'flashcard'
      }, 
      (err, res) => {
        if (err) { 
          console.log('saving note:', res);
          return console.log('error saving note to db:', err); 
        }
      });

      document.getElementById('first-lang-text').value = '';
      document.getElementById('second-lang-text').value = '';
    }
  }

  render() {
    return (
      <div className="user-profile">
        {
          this.state.viewAll ?
            this.props.notes.map(note =>
              <div>
                <text onClick={this.displayNote.bind(this, note)}>{note.title}</text>
              </div>
            )
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
        </div>
      </div>
    )
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
            <input id='first-lang-text' type="text" defaultValue={this.props.note.text[this.props.user.profile.language]}/>
          </div>
        </div>

        <div className='second-language-container'>
          <div className='language'>
            <text>{this.props.user.profile.learning}</text>
          </div>
          <div className='text'>
            <input id='second-lang-text' type="text" defaultValue={this.props.note.text[this.props.user.profile.learning]}/>
          </div>
        </div>
      </div>
    )
  }
}

export default Notes;
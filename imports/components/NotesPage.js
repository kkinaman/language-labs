import React from 'react';
import NavigationWrapper from './NavigationWrapper';
import _ from 'lodash';

class NotesPage extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className='notes-page'>
        <NavigationWrapper returnToNav={ this.props.returnToNav } />
          <h1>Notes</h1>  
        <div className='notes-main'>
          <div className='notes-container shadowbox'>
            <div className='notes shadowbox'>
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
          </div>
          <div className='flashcards-container shadowbox'>
            <div className='notes shadowbox'>
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
                      if (note.noteType === 'flashcard'  && 
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
            </div>  
          </div>  
        </div>
      </div>
    )
  }
}

export default NotesPage;
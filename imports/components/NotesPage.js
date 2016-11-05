import React from 'react';
import NavigationWrapper from './NavigationWrapper';
import _ from 'lodash';

class NotesPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      displayedLanguage: _.capitalize(this.props.user.profile.learning)
    }
  }

  changeDisplayedLanguage(event) {
    this.setState({
      displayedLanguage: event.target.value
    });
  }

  render() {
    return (
      <div className='notes-page'>
        <NavigationWrapper returnToNav={ this.props.returnToNav } />
          <h1>Notes</h1> 

          <select defaultValue={_.capitalize(this.props.user.profile.learning)}
                  onChange={this.changeDisplayedLanguage.bind(this)}>
            <option value="French">French</option>
            <option value="Spanish">Spanish</option>
            <option value="German">German</option>
            <option value='English'>English</option>
          </select>
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
                    <th>{_.capitalize(this.state.displayedLanguage)}</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    this.props.notes.map(note => {
                      if (note.noteType === 'flashcard'  && 
                        Object.keys(note.text).indexOf(this.props.user.profile.language.toLowerCase()) !== -1 &&
                        Object.keys(note.text).indexOf(this.state.displayedLanguage.toLowerCase()) !== -1) {
                        return (
                          <tr>
                            <td><text>{note.text[this.props.user.profile.language.toLowerCase()]}</text></td>
                            <td><text>{note.text[this.state.displayedLanguage.toLowerCase()]}</text></td>
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
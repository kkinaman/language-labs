import React, { Component } from 'react';
import { View, ScrollView, TouchableOpacity, Text, TouchableHighlight } from 'react-native';
import { Header, Container, Button, Title, Content, Footer, List, ListItem, Input, InputGroup, DeckSwiper, Card, CardItem, Thumbnail } from 'native-base';
import { Ionicons } from '@exponent/vector-icons';
import { Font } from 'exponent';
var _ = require('lodash');

export default class FlashcardsScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      flashcards: [],
      noteView: false
    };
  }

  async componentDidMount() {
    await Font.loadAsync({
      'pacifico': require('./assets/fonts/Pacifico.ttf'),
      'montserrat': require('./assets/fonts/Montserrat-Regular.ttf')
    });
    this.setState({ fontLoaded: true });
  }

  componentWillMount() {
    this.getFlashcards();
  }

  _navigate() {
    this.props.navigator.push({
      name: 'HomeScreen',
      passProps: {
        'userId': id,
        'username': username,
        'knownLang': knownLang,
        'learningLang': learningLang
      }
    });
  }

  getFlashcards() {
    var context = this;
    fetch('http://10.6.26.241:6000/api/notes/id/' + this.props.userId, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(function(res) {
      var notes = JSON.parse(res['_bodyInit']).filter(function(note) {
        return note.noteType === 'flashcard';
      });
      
      notes = notes.filter(function(note) {
        return _.includes(Object.keys(note.text), 'spanish');
      });
      console.log(_.reverse(notes))
      context.setState({flashcards: notes, noteView: true});
    });
  }

  render() {
    var header = this.props.knownLang + ' -> ' + this.props.learningLang;
    return (
      <View>
        <Header>
          <Button transparent onPress={() => this.props.navigator.pop()}>
            <Text style={{fontFamily: 'montserrat'}}>
              <Ionicons name="ios-arrow-back" size={32} style={{color: '#25a2c3', marginTop: 5}}/>
            </Text>
          </Button>
          <Title style={{fontFamily: 'montserrat'}}>{header}</Title>
        </Header>
        {
          this.state.noteView ?
          <Flashcards notes={this.state.flashcards} known={this.props.knownLang} learning={this.props.learningLang}/>
          :
          null
        }
      </View>
    );
  }
}

class Flashcards extends React.Component {
  constructor(props) {
    super(props);
    this.state = ({
      isTranslationVisible: false,
    });
  }

  showTranslation() {
    this.setState({
      isTranslationVisible: true
    });
  }

  hideTranslation() {
    this.setState({
      isTranslationVisible: false
    });
  }

  render() {
    console.log(this.props.notes)
    return (
      <Container style={{marginTop: 150, marginLeft: 20, marginRight: 20}}>
        <View>
          {
            this.props.notes.length === 1 ?
            <Card>
              <CardItem>
                <Text style={{fontSize: 30, fontFamily: 'montserrat'}}>{this.props.known}: {this.props.text[this.props.known]}</Text>
              </CardItem>
              <CardItem>
                <Text style={{fontSize: 30, fontFamily: 'montserrat'}}>{this.props.learning}: {this.props.text[this.props.learning]}</Text>
              </CardItem>
            </Card>
            :
            <DeckSwiper
              dataSource={this.props.notes}
              onSwipeRight={this.hideTranslation.bind(this)}
              onSwipeLeft={this.hideTranslation.bind(this)}
              renderItem={note =>
                <TouchableOpacity onPress={this.showTranslation.bind(this)}>
                <View>
                  <Card style={{justifyContent: 'center', alignItems: 'center', height: 300}}>
                    <CardItem>
                      <Text style={{fontSize: 30, fontFamily: 'montserrat'}} onPress={this.showTranslation.bind(this)}>{note.text[this.props.known]}</Text>
                    </CardItem>
                    <CardItem>
                      {
                        this.state.isTranslationVisible ?
                        <Text style={{fontSize: 30, fontFamily: 'montserrat'}}>{note.text[this.props.learning]}</Text>
                        :
                        <Text style={{fontSize: 20, fontFamily: 'montserrat', color: 'gray'}} onPress={this.showTranslation.bind(this)} note>Press here to reveal translation</Text>
                      }
                    </CardItem>
                  </Card>
                </View>
                </TouchableOpacity>
              }
            />
          }
        </View>
      </Container>
    );
  }
}

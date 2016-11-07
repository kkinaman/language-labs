import React, { Component } from 'react';
import { View, ScrollView, TouchableOpacity, Text, TouchableHighlight } from 'react-native';
import { Header, Container, Button, Title, Content, Footer, List, ListItem, Input, InputGroup, DeckSwiper, Card, CardItem, Thumbnail } from 'native-base';
import { Ionicons } from '@exponent/vector-icons';
import { Font } from 'exponent';


export default class FlashcardsScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      freeForm: [],
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
        return note.noteType === 'freeForm';
      });
      context.setState({freeForm: notes, noteView: true});
    });
  }

  render() {
    return (
      <View>
        <Header>
          <Button transparent onPress={() => this.props.navigator.pop()}>
            <Ionicons name="ios-arrow-back" size={32} style={{color: '#25a2c3', marginTop: 5}}/>
          </Button>
          <Title style={{fontFamily: 'montserrat'}}>Notes</Title>
        </Header>
        {
          this.state.noteView ?
          <FreeForm notes={this.state.freeForm} known={this.props.knownLang} learning={this.props.learningLang}/>
          :
          null
        }
      </View>
    );
  }
}

class FreeForm extends React.Component {
  render() {
    return (
      <Container style={{marginTop: 150, marginLeft: 20, marginRight: 20}}>
        <View>
          {
            this.props.notes.length === 1 ?
            <Card>
              <CardItem>
                <Text style={{fontSize: 20, fontFamily: 'montserrat'}}>{this.props.known}: {this.props[0].text}</Text>
              </CardItem>
            </Card>
            :
            <DeckSwiper
              dataSource={this.props.notes}
              renderItem={note =>
                <View>
                  <Card style={{justifyContent: 'center', alignItems: 'center', height: 300}}>
                    <CardItem>
                      <Text style={{fontSize: 20, fontFamily: 'montserrat'}}>{note.text}</Text>
                    </CardItem>
                  </Card>
                </View>
              }
            />
          }
        </View>
      </Container>
    );
  }
}

import Exponent from 'exponent';
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  AlertIOS
} from 'react-native';
import { Font } from 'exponent';
import { Container, Header, Title, Content, Footer, Button } from 'native-base';
import { Ionicons } from '@exponent/vector-icons';


export default class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fontLoaded: false
    }
  }

  async componentDidMount() {
    await Font.loadAsync({
      'pacifico': require('./assets/fonts/Pacifico.ttf'),
      'montserrat': require('./assets/fonts/Montserrat-Regular.ttf')
    });
    this.setState({ fontLoaded: true });
  }

  _navigate(sceneName) {
    this.props.navigator.push({
      name: sceneName,
      passProps: {
        'username': this.props.username,
        'userId': this.props.userId,
        'knownLang': this.props.knownLang,
        'learningLang': this.props.learningLang,
        'prevScene': 'HomeScreen'
      }
    });
  }

  _navigateLogout() {
    this.props.navigator.push({
      name: 'LoginScreen'
    })
  }

  logout() {
    AlertIOS.alert("Logout Success!")
    this._navigateLogout();
  }

  render() {
    return (
      <Container>
        <View style={styles.backgroundImageWrapper}>
        </View>
        <Header style={{height: 80, zIndex: 1}}>
          <Button transparent><Text style={styles.buttonText}> </Text></Button>
          <Title style={styles.headerText}>Language  Labs</Title>
          <Button transparent onPress={this.logout.bind(this)}>
            <Ionicons name="ios-log-out" size={35} color="#444" />
          </Button>
        </Header>
        <View style={styles.container}>
          {
            this.state.fontLoaded ? (
            <View style={styles.centered}>

              <View style={{flexDirection: 'column'}}>
                <Button primary style={styles.choiceButton} onPress={this._navigate.bind(this, 'FlashcardsScreen')}>
                  <Text style={[styles.buttonText, styles.choiceButtonText]}>
                    Flashcards
                  </Text>
                </Button>

                <Button primary style={styles.choiceButton} onPress={this._navigate.bind(this, 'NotesScreen')}>
                  <Text style={[styles.buttonText, styles.choiceButtonText]}>
                    Notes
                  </Text>
                </Button>

                <Button primary style={styles.choiceButton} onPress={this._navigate.bind(this, 'VideosScreen')}>
                  <Text style={[styles.buttonText, styles.choiceButtonText]}>
                    Video History
                  </Text>
                </Button>
              </View>
            </View>
            ) : null
          }
        </View>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  backgroundImageWrapper: {
    position: 'absolute',
    top: 0,
    zIndex: 0,
    alignItems: 'center'
  },

  backgroundImage: {
    flex: 1,
    resizeMode: 'stretch'
  },

  headerText: {
    ...Font.style('pacifico'),
    fontSize: 30,
    color: '#444',
    paddingTop: 35
  },

  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },

  centered: {
    alignItems: 'center'
  },

  flexRow: {
    flexDirection: 'row'
  },

  flexCol: {
    flexDirection: 'column'
  },

  choiceButton: {
    height: 80,
    width: 170,
    borderRadius: 4,
    backgroundColor: '#5fa9d9',
    margin: 5
  },

  takePhotoButton: {
    height: 220,
    width: 220,
    borderRadius: 110,
    backgroundColor: '#25a2c3',
  },

  buttonText: {
    ...Font.style('montserrat'),
    fontWeight: 'bold',
    color: '#fff'
  },

  choiceButtonText: {
    fontSize: 22
  },

  takePhotoButtonText: {
    fontSize: 27,
    paddingTop: 20
  }
});

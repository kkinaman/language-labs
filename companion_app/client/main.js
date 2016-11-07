import Exponent from 'exponent';
import React from 'react';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import NotesScreen from './screens/NotesScreen';
import FlashcardsScreen from './screens/FlashcardsScreen';
import VideosScreen from './screens/VideosScreen';

import {
  Navigator
} from 'react-native';

class App extends React.Component {
  renderScene(route, navigator) {
    if (route.name === 'LoginScreen') {
      return <LoginScreen navigator={navigator} />;
    }
    if (route.name === 'HomeScreen') {
      return <HomeScreen navigator={navigator} {...route.passProps}/>;
    }
    if (route.name === 'NotesScreen') {
      return <NotesScreen navigator={navigator} {...route.passProps}/>;
    }
    if (route.name === 'FlashcardsScreen') {
      return <FlashcardsScreen navigator={navigator} {...route.passProps}/>;
    }
    if (route.name === 'VideosScreen') {
      return <VideosScreen navigator={navigator} {...route.passProps}/>;
    }

  }

  render() {
    return (
      <Navigator
        initialRoute={{ name: 'LoginScreen' }}
        renderScene={this.renderScene}
      />
    );
  }
}

Exponent.registerRootComponent(App);

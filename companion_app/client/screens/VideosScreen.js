import * as Exponent from 'exponent';
import React, { Component } from 'react';
import { View, requireNativeComponent, ScrollView, TouchableOpacity, Text, TouchableHighlight } from 'react-native';
import { Header, Container, Button, Title, Content, Footer, List, ListItem, Input, InputGroup, DeckSwiper, Card, CardItem, Thumbnail } from 'native-base';
import { Ionicons } from '@exponent/vector-icons';
// import { Video } from 'react-native-video';

export default class VideosScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      freeForm: [],
      noteView: false
    };
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

  render() {
    return (
      <View>
 
        <Exponent.Components.Video  source={{uri: "https://youtu.be/N24XK5AXCMs"}}   // Can be a URL or a local file.
             resizeMode="cover" repeat={true} key="video2"   />
      </View>
    );
  }
}
import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import BottomSheet from 'react-native-bottom-sheet';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\nCmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\nShake or press menu button for dev menu',
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false
    };
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome} onPress={() => { this.setState({ show: true }); }}>Welcome to React Native!</Text>
        <Text style={styles.instructions}>To get started, edit App.js</Text>
        <Text style={styles.instructions}>{instructions}</Text>
        <BottomSheet items={[{ key: '1', label: '1' }, { key: '2', label: '2' }]} show={this.state.show} onDismiss={() => { this.setState({ show: false }); }} />
      </View>
    );
  }
}

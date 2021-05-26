import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import * as Permissions from 'expo-permissions';
import * as Notifications from 'expo-notifications';

const PUSH_REGISTRATION_ENDPOINT = 'http://6d73e95bc864.ngrok.io/token';
const MESSAGE_ENPOINT = 'http://6d73e95bc864.ngrok.io/message';

export default class App extends React.Component {
  state = {
    notification: null,
    messageText: ''
  }

  registerForPushNotificationAsync = async () => {
    const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    if (status !== 'granted') {
      return;
    }
    let token = await Notifications.getExpoPushTokenAsync();

    fetch(PUSH_REGISTRATION_ENDPOINT, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: {
          value: token,
        },
        user: {
          username: 'warly',
          name: 'Dan Ward'
        },
      }),
    });

    this.notificationSubscription = Notifications.addNotificationReceivedListener(this.handleNotification);
  }

  handleNotification = (notification) => {
    this.setState({ notification });
  }

  componentDidMount () {
    this.registerForPushNotificationAsync();
  }

  handleChangeText = (text) => {
    this.setState({ messageText: text });
  }

  sendMesssage = async () => {
    fetch(MESSAGE_ENPOINT, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: this.state.messageText,
      }),
    });
    this.setState({ messageText: '' });
  }

  render () {
    return (
      <View style = {styles.container}>
        <TextInput
          value = {this.state.messageText}
          onChangeText={this.handleChangeText}
          style={styles.textInput}
        />
          <TouchableOpacity
            style={styles.button}
            onPress={this.sendMesssage}>
              <Text style={styles.buttonText}>Send</Text>
          </TouchableOpacity>
          {this.state.notification ? 
              this.renderNotification()
            : null}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#474747',
    alignItems: 'center',
    justifyContent: 'center'
  },
  textInput: {
    height: 50,
    width: 300,
    borderColor: '#f6f6f6',
    borderWidth: 1,
    backgroundColor: '#fff',
    padding: 10
  },
  button: {
    padding: 10
  },
  buttonText: {
    fontSize: 18,
    color: '#fff'
  },
  label: {
    fontSize: 18
  }
});
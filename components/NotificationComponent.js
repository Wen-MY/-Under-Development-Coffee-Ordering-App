import React, { Component } from 'react';
import { View, Text } from 'react-native';

class NotificationComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      message: 'No new notifications',
    };

    this.timer = null;
  }
  componentDidMount() {
    // Simulate receiving a notification after 3 seconds
    this.timer = setTimeout(() => {
      this.setState({ message: 'New notification: Your order is ready!' });
    }, 3000);
  }
  componentDidUpdate(prevProps, prevState) {
    // Check if the message has changed and reset it after 5 seconds
    if (prevState.message !== this.state.message) {
      setTimeout(() => {
        this.setState({ message: 'No new notifications' });
      }, 5000);
    }
  }
  componentWillUnmount() {
    // Clear the timer when the component is unmounted
    if (this.timer) {
      clearTimeout(this.timer);
    }
  }
  render() {
    return (
      <View>
        <Text style={{fontSize: 16,color: '#0f4c81',marginTop: 15}}>{this.state.message}</Text>
      </View>
    );
  }
}
export default NotificationComponent;

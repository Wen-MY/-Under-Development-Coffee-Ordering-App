import React, { Component } from 'react';
import { View, Text } from 'react-native';

class SuccessOrderScreen extends Component {
  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Your order has been placed successfully!</Text> {/* Modified message */}
      </View>
    );
  }
}

export default SuccessOrderScreen;

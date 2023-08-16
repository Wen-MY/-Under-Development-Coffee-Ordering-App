import React, { Component } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

class PaymentScreen extends Component {
  state = {
    name: '',
    address: '',
    cardNumber: '',
    cvv: '',
    email: '', // Add email state
  };

  handlePayment = () => {
    if (this.validateForm()) {
      this.props.navigation.navigate('SuccessOrder');
    } else {
      alert('Please fill out all fields correctly.');
    }
  };

  validateForm = () => {
    const { name, address, cardNumber, cvv, email } = this.state;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const cardNumberRegex = /^[0-9]{16}$/; // 16-digit number

    return (
      name &&
      address &&
      cardNumberRegex.test(cardNumber) && // Validate card number
      cvv &&
      emailRegex.test(email)
    );
  };



  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.heading}>Payment Information</Text>
        <TextInput
          style={styles.input}
          placeholder="Name"
          onChangeText={(text) => this.setState({ name: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Address"
          onChangeText={(text) => this.setState({ address: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Card Number"
          onChangeText={(text) => this.setState({ cardNumber: text })}
          maxLength={16} // Limit to 16 characters
          keyboardType="numeric" // Show numeric keyboard
        />
        <TextInput
          style={styles.input}
          placeholder="CVV"
          onChangeText={(text) => this.setState({ cvv: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          onChangeText={(text) => this.setState({ email: text })}
        />
        <Button title="Make Payment" onPress={this.handlePayment} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  heading: {
    fontSize: 20,
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    padding: 5,
  },
});

export default PaymentScreen;

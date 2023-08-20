import React, { Component } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

class SuccessOrderScreen extends Component {
  navigateToMenuScreen = () => {
    this.props.navigation.navigate('Menu'); // Replace 'Menu' with the actual name of your menu screen
  };

  render() {
    // Example transaction details (you can replace this with actual data)
    const transactionNumber = 'TRX123456789';
    const amountPaid = '$35.00';
    const paymentMethod = 'MasterCard';

    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Icon name="check-circle" size={50} color="green" />
        <Text style={styles.successText}>Your order has been placed successfully!</Text>

        <View style={styles.transactionContainer}>
          <Text style={styles.transactionLabel}>Transaction Number: {transactionNumber}</Text>
          <Text style={styles.transactionLabel}>Amount Paid: {amountPaid}</Text>
          <Text style={styles.transactionLabel}>Payment Method: {paymentMethod}</Text>
        </View>

        <Button title="Continue Shopping" onPress={this.navigateToMenuScreen} style={styles.button} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  successText: {
    marginTop: 10,
    fontSize: 18,
  },
  transactionContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: 'lightgray',
    borderRadius: 8,
    marginBottom:40,
  },
  transactionLabel: {
    marginTop: 5,
    fontWeight: 'bold',
  },
  button: {
    marginTop: 20, // Add margin to the button
  },
});

export default SuccessOrderScreen;

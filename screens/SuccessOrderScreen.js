import React, { Component } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';


class SuccessOrderScreen extends Component {
  navigateToMenuScreen = () => {
    this.props.navigation.navigate('Menu'); // Replace 'Menu' with the actual name of your menu screen
  };

  render() {
    // Receive both totalAmount and paymentMethod as parameters from navigation props
    const { route } = this.props;
    const { totalAmount, paymentMethod } = route.params;
    // Example transaction details (you can replace this with actual data)
    const transactionNumber = 'TRX123456789';
    const amountPaid = totalAmount;
   
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <FontAwesomeIcon name="check-circle" size={50} color="green" />
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
    fontFamily: 'Montserrat',
    color: '#4A4A4A',
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
    borderRadius: 10,
    marginBottom:40,
    shadowColor: '#000000', // Shadow color
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2, // Shadow opacity
    shadowRadius: 4, // Shadow radius
    elevation: 5, // Android shadow elevation
    backgroundColor: '#ffffff',
    
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

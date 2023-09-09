import React, { Component } from 'react';
import { View, Text, Button, StyleSheet, Image } from 'react-native';
import successOrderImage from '../assets/otherImg/SuccessOrder.jpg';

class SuccessOrderScreen extends Component {
  constructor(props) {
    super(props);
    // Remove these lines from the constructor
    // const { route } = route.params;
    // const { totalAmount } = route.params;
    // const { paymentMethod } = route.params;
    // Example transaction details (you can replace this with actual data)
    // const transactionNumber = 'TRX123456789';
    // const amountPaid = totalAmount;
  }

  navigateToMenuScreen = () => {
    this.props.navigation.navigate('Menu'); // Replace 'Menu' with the actual name of your menu screen
  };

  render() {
    // Receive both totalAmount and paymentMethod as parameters from navigation props
    const { route } = this.props;
    const { formattedTotalAmount, paymentMethod } = this.props.route.params;
    // Example transaction details (you can replace this with actual data)
    const transactionNumber = 'TRX123456789';
    const amountPaid = formattedTotalAmount;

    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <View style={styles.imageFrame}>
          <Image source={successOrderImage} style={styles.successOrderImage} />
        </View>
        <Text style={styles.successText}>Your order has been placed successfully!</Text>

        <View style={styles.transactionContainer}>
          <Text style={styles.transactionLabel}>Transaction Number: {transactionNumber}</Text>
          <Text style={styles.transactionLabel}>Amount Paid: ${amountPaid}</Text>
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
    color: 'green',
    marginTop: 10,
    fontSize: 18,
  },
  transactionContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'lightgray',
    borderRadius: 10,
    marginBottom: 40,
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
  successOrderImage: {
    height: 250,
    width: 250,
  },
  imageFrame: {
    borderWidth: 2, // Border width
    borderColor: 'black', // Border color
    padding: 5, // Padding around the image
    borderRadius: 10, // Border radius for rounded corners
  },
});

export default SuccessOrderScreen;

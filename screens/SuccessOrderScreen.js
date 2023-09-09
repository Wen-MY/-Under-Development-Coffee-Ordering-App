import React, { Component } from 'react';
import { View, Text, Button, StyleSheet, Image } from 'react-native';
import successOrderImage from '../assets/otherImg/SuccessOrder.jpg';
import SQLite from 'react-native-sqlite-storage';

class SuccessOrderScreen extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    // Clear the cart after a successful order
    const db = SQLite.openDatabase({ name: 'coffeeDatabase' });
    db.transaction((tx) => {
      tx.executeSql(
        'DELETE FROM cart',
        [],
        (tx, results) => {
          console.log('Cart cleared successfully');
        },
        (error) => {
          console.log('Error clearing cart: ', error);
        }
      );
    });
  }

  navigateToCartScreen = () => {
    this.props.navigation.navigate('Shopping Cart'); // Replace 'Cart' with the actual name of your cart screen
  };

  render() {
    // Receive totalAmount and paymentMethod as parameters from navigation props
    const { formattedTotalAmount, paymentMethod } = this.props.route.params;
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

        <Button title="Continue Shopping" onPress={this.navigateToCartScreen} style={styles.button} />
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
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    backgroundColor: '#ffffff',
  },
  transactionLabel: {
    marginTop: 5,
    fontWeight: 'bold',
  },
  button: {
    marginTop: 20,
  },
  successOrderImage: {
    height: 250,
    width: 250,
  },
  imageFrame: {
    borderWidth: 2,
    borderColor: 'black',
    padding: 5,
    borderRadius: 10,
  },
});

export default SuccessOrderScreen;

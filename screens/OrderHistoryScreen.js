import React, { Component } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class OrderHistoryScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      orderHistory: [],
    };
  }

  async componentDidMount() {
    try {
      // Retrieve the order history from AsyncStorage
      const orderHistory = await AsyncStorage.getItem('orderHistory');

      if (orderHistory !== null) {
        this.setState({ orderHistory: JSON.parse(orderHistory) });
      }
    } catch (error) {
      console.error('Error retrieving order history:', error);
    }
  }

  render() {
    const { orderHistory } = this.state;

    return (
      <ScrollView style={styles.container}>
        <Text style={styles.heading}>Order History</Text>

        {orderHistory.map((order, index) => (
          <View key={index} style={styles.orderContainer}>
            <Text style={styles.orderTitle}>Order {index + 1}</Text>
            <Text style={styles.orderItemText}>Order ID: {order.id}</Text>
            <Text style={styles.orderItemText}>
              Order Date and Time: {order.dateTime}
            </Text>
            <Text style={styles.orderItemText}>
              Payment Method: {order.paymentMethod}
            </Text>
            <Text style={styles.orderTotalText}>
              Total Amount: ${order.totalAmount.toFixed(2)}
            </Text>
            <Text style={styles.orderSubtitle}>Order Details:</Text>
            {order.orderItems.map((item, itemIndex) => (
              <View key={itemIndex} style={styles.itemContainer}>
                <Text style={styles.itemName}>Item: {item.name}</Text>
                <Text style={styles.itemQuantity}>Quantity: {item.quantity}</Text>
                <Text style={styles.itemSubtotal}>
                  Subtotal: ${(item.price * item.quantity).toFixed(2)}
                </Text>
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#4A4A4A',
  },
  orderContainer: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'lightgray',
    borderRadius: 8,
    padding: 10,
    backgroundColor: 'white',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  orderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  orderItemText: {
    fontSize: 16,
    marginBottom: 5,
  },
  orderTotalText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  orderSubtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  itemContainer: {
    marginTop: 5,
  },
  itemName: {
    fontSize: 14,
  },
  itemQuantity: {
    fontSize: 14,
  },
  itemSubtotal: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default OrderHistoryScreen;

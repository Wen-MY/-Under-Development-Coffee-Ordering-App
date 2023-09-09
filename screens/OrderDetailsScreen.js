import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';

class OrderDetailsScreen extends Component {
  render() {
    const { route } = this.props;
    const { selectedOrder } = route.params;

    return (
      <View style={styles.container}>
        <Text style={styles.heading}>Order Details</Text>
        <Text style={styles.orderText}>Order ID: {selectedOrder.id}</Text>
        <Text style={styles.orderText}>Order Date and Time: {selectedOrder.order_date}</Text>
        <Text style={styles.orderText}>Total Amount: ${selectedOrder.total_amount.toFixed(2)}</Text>
        <Text style={styles.orderSubtitle}>Order Items:</Text>
        {selectedOrder.orderItems.map((item, itemIndex) => (
          <View key={itemIndex} style={styles.itemContainer}>
            <Text style={styles.itemText}>Item: {item.name}</Text>
            <Text style={styles.itemText}>Quantity: {item.quantity}</Text>
            <Text style={styles.itemText}>
              Subtotal: ${(item.base_price * item.quantity).toFixed(2)}
            </Text>
          </View>
        ))}
      </View>
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
  orderText: {
    fontSize: 16,
    marginBottom: 5,
  },
  orderSubtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  itemContainer: {
    marginTop: 5,
  },
  itemText: {
    fontSize: 14,
  },
});

export default OrderDetailsScreen;

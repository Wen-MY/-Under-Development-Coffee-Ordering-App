import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

class OrderDetailsScreen extends Component {
  render() {
    const { route } = this.props;
    const { selectedOrder } = route.params;

    return (
      <ScrollView style={styles.container}>
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
            {/* Add a separator line between items */}
            {itemIndex < selectedOrder.orderItems.length - 1 && <View style={styles.separator} />}
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
    marginTop: 10,
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'lightgray',
    paddingBottom: 10,
  },
  itemText: {
    fontSize: 14,
    marginBottom: 5,
  },
  separator: {
    height: 1,
    backgroundColor: 'lightgray',
    marginVertical: 5,
  },
});

export default OrderDetailsScreen;

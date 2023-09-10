import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import SQLite from 'react-native-sqlite-storage';

class OrderDetailsScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      orderItems: [], // Store the order items
    };

    this.db = SQLite.openDatabase(
      { name: 'coffeeDatabase', location: 'default' },
      this.openCallback,
      this.errorCallback
    );
  }

  componentDidMount() {
    // Fetch order items based on the order ID
    const { route } = this.props;
    const { order } = route.params;

    this.fetchOrderItems(order);
  }

  fetchOrderItems(order) {
    this.db.transaction((tx) => {
      tx.executeSql(
        'SELECT item_name, quantity FROM order_items WHERE order_id = ?',
        [order.Id],
        (tx, results) => {
          const orderItems = [];
          const len = results.rows.length;
          for (let i = 0; i < len; i++) {
            const row = results.rows.item(i);
            orderItems.push({
              name: row.item_name,
              quantity: row.quantity,
              //base_price: row.base_price,
            });
          }
          this.setState({ orderItems });
        },
        (tx, error) => {
          console.log('Error fetching order items:', error);
        }
      );
    });
  }

  render() {
    const { route } = this.props;
    const { order } = route.params; // Use 'order' that was passed from the previous screen
    const { orderItems } = this.state;

    return (
      <ScrollView style={styles.container}>
        <Text style={styles.heading}>Order Details</Text>
        <Text style={styles.orderText}>Order ID: {order.id}</Text>
        <Text style={styles.orderText}>Order Date and Time: {order.order_date}</Text>
        <Text style={styles.orderText}>Total Amount: ${order.total_amount}</Text>
        <Text style={styles.orderSubtitle}>Order Items:</Text>
        {orderItems.length === 0 ? (
          <Text style={styles.noOrderItemsText}>No items in this order.</Text>
        ) : (
          orderItems.map((item, itemIndex) => (
            <View key={itemIndex} style={styles.itemContainer}>
              <Text style={styles.itemText}>Item: {item.name}</Text>
              <Text style={styles.itemText}>Quantity: {item.quantity}</Text>
              {/* Add a separator line between items */}
              {itemIndex < orderItems.length - 1 && <View style={styles.separator} />}
            </View>
          ))
        )}
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
  noOrderItemsText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'gray',
    marginTop: 10,
  },
});

export default OrderDetailsScreen;

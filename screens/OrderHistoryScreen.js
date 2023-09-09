import React, { Component } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import SQLite from 'react-native-sqlite-storage';

class OrderHistoryScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      orderHistory: [],
    };

    // Initialize the SQLite database in the constructor
    this.db = SQLite.openDatabase(
      { name: 'coffeeDatabase', location: 'default' },
      this.openCallback,
      this.errorCallback
    );
  }

  componentDidMount() {
    // Fetch and set the order history when the component mounts
    this.fetchOrderHistory();
  }

  fetchOrderHistory() {
    this.db.transaction((tx) => {
      tx.executeSql(
        'SELECT orders.id AS order_id, user_id, total_amount, order_date, ' +
        'order_items.id AS item_id, name, description, base_price, type, quantity ' +
        'FROM orders ' +
        'INNER JOIN order_items ON orders.id = order_items.order_id ' +
        'INNER JOIN items ON order_items.item_id = items.id ' +
        'ORDER BY orders.order_date DESC',
        [],
        (tx, results) => {
          console.log('Query results:', results);
          const orderHistory = [];
          const len = results.rows.length;
          for (let i = 0; i < len; i++) {
            const row = results.rows.item(i);
            const orderId = row.order_id;
            const order = orderHistory.find((o) => o.id === orderId);
  
            if (!order) {
              // Create a new order entry in the history
              const newOrder = {
                id: orderId,
                user_id: row.user_id,
                total_amount: row.total_amount,
                order_date: row.order_date,
                orderItems: [
                  {
                    id: row.item_id,
                    name: row.name,
                    description: row.description,
                    base_price: row.base_price,
                    type: row.type,
                    quantity: row.quantity,
                  },
                ],
              };
              orderHistory.push(newOrder);
            } else {
              // Add item to an existing order entry
              order.orderItems.push({
                id: row.item_id,
                name: row.name,
                description: row.description,
                base_price: row.base_price,
                type: row.type,
                quantity: row.quantity,
              });
            }
          }
          this.setState({ orderHistory }); // Update the state here
        },
        (tx, error) => {
          console.log('Error fetching order history:', error);
        }
      );
    });
  } 

  openCallback() {
    console.log('Database opened successfully');
  }

  errorCallback(err) {
    console.log('Error in opening database: ' + err);
  }

  render() {
    const { orderHistory } = this.state;

    return (
      <ScrollView style={styles.container}>
        <Text style={styles.heading}>Order History</Text>

        {orderHistory.length === 0 ? (
          <Text style={styles.noOrdersText}>No orders available yet.</Text>
        ) : (
          orderHistory.map((order, index) => (
            <View key={index} style={styles.orderContainer}>
              <Text style={styles.orderTitle}>Order {index + 1}</Text>
              <Text style={styles.orderItemText}>Order ID: {order.id}</Text>
              <Text style={styles.orderItemText}>
                Order Date and Time: {order.order_date} {/* Use 'order_date' property */}
              </Text>
              <Text style={styles.orderTotalText}>
                Total Amount: ${order.total_amount.toFixed(2)} {/* Use 'total_amount' property */}
              </Text>
              <Text style={styles.orderSubtitle}>Order Details:</Text>
              {order.orderItems.map((item, itemIndex) => (
                <View key={itemIndex} style={styles.itemContainer}>
                  <Text style={styles.itemName}>Item: {item.name}</Text>
                  <Text style={styles.itemQuantity}>Quantity: {item.quantity}</Text>
                  <Text style={styles.itemSubtotal}>
                    Subtotal: ${(item.base_price * item.quantity).toFixed(2)} {/* Use 'base_price' */}
                  </Text>
                </View>
              ))}
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
  noOrdersText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'gray',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default OrderHistoryScreen;

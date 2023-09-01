import React, { Component } from 'react';
import { View, Text } from 'react-native';
import SQLite from 'react-native-sqlite-storage';

export default class OrderDetailsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orderDetails: [],
    };
    this.db = SQLite.openDatabase(
      { name: 'coffeeDatabase' },
      () => {
        console.log('database open success');
      },
      (err) => {
        console.log('Error in opening database: ' + err);
      }
    );
  }

  componentDidMount() {
    // Use the passed order ID from the props
    const orderId = this.props.route.params.orderId;
    this.fetchOrderDetails(orderId);
  }

  
  fetchOrderDetails(orderId) {
    this.db.transaction((tx) => {
      tx.executeSql('SELECT * FROM order_details WHERE order_id = ?', [orderId], (tx, results) => {
        this.setState({ orderDetails: results.rows.raw() });
      });
    });
  }

  render() {
    return (
      <View>
        <Text>Order Details</Text>
        {this.state.orderDetails.map((item) => (
          <Text key={item.id}>
            Item: {item.itemName}, Quantity: {item.quantity}, Subtotal: ${item.subtotal.toFixed(2)}
          </Text>
        ))}
      </View>
    );
  }
}

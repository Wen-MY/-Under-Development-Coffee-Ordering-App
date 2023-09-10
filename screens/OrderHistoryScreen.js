import React, { Component } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import SQLite from 'react-native-sqlite-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

class OrderHistoryScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      orderHistory: [],
    };

    this.db = SQLite.openDatabase(
      { name: 'coffeeDatabase', location: 'default' },
      this.openCallback,
      this.errorCallback
    );
  }

  componentDidMount() {
    this.fetchOrderHistory();
  }

  navigateToOrderDetails(order) {
    this.props.navigation.navigate('OrderDetails', { order });
  }

  fetchOrderHistory = async () => {
    try {
      const id = await AsyncStorage.getItem('id');
      this.db.transaction((tx) => {
        tx.executeSql(
          "SELECT id, order_date FROM orders WHERE user_id = ? ORDER BY order_date DESC",
          [id],
          (tx, results) => {
            const orderHistory = [];
            const len = results.rows.length;
            for (let i = 0; i < len; i++) {
              const row = results.rows.item(i);
              orderHistory.push({
                id: row.id,
                order_date: row.order_date,
              });
            }
            this.setState({ orderHistory });
          },
          (tx, error) => {
            console.log('Error fetching order history:', error);
          }
        );
      });
    } catch (error) {
      console.log('Error fetching order history:', error);
    }
  }

  openCallback() {
    console.log('Database opened successfully');
  }

  errorCallback(err) {
    console.log('Error in opening database: ' + err);
  }

  renderOrderSummary(order) {
    return (
      <TouchableOpacity
        key={order.id}
        onPress={() => this.navigateToOrderDetails(order)}
        style={styles.orderContainer}
      >
        <Text style={styles.orderTitle}>Order ID: {order.id}</Text>
        <Text style={styles.orderItemText}>Order Date and Time: {order.order_date}</Text>
        <View style={styles.separator} />
      </TouchableOpacity>
    );
  }

  render() {
    const { orderHistory } = this.state;

    if (orderHistory === null) {
      return (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      );
    }

    if (orderHistory.length === 0) {
      return (
        <View style={styles.noOrdersContainer}>
          <Text style={styles.noOrdersText}>No orders available yet.</Text>
        </View>
      );
    }

    return (
      <ScrollView style={styles.container}>
        {orderHistory.map(order => this.renderOrderSummary(order))}
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
  separator: {
    height: 1,
    backgroundColor: 'lightgray',
    marginTop: 10,
    marginBottom: 5,
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
  noOrdersText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'gray',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default OrderHistoryScreen;

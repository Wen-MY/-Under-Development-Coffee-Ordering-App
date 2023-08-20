import React, { Component } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import SQLite from 'react-native-sqlite-storage';
import { commonStyles } from '../style/CommonStyle';

export default class OrderHistoryScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orders: [],
    };
    this.db = SQLite.openDatabase(
      { name: 'coffeeDatabase', location: 'default' },
      () => {
        console.log('Database opened successfully');
        this.fetchOrders(); // Fetch orders right after opening the database
      },
      (err) => {
        console.error('Error in opening database: ' + err);
      }
    );
  }

  deleteOrdersTable() {
    console.log('Deleting orders table...');
    this.db.transaction((tx) => {
      tx.executeSql(
        'DROP TABLE IF EXISTS orders',
        [],
        () => {
          console.log('Orders table deleted successfully');
          // You might want to call createOrdersTable or perform other actions after deleting the table
        },
        (error) => {
          console.error('Error deleting orders table', error);
        }
      );
    });
  }

  // Create orders table
  createOrdersTable() {
    console.log('Creating orders table...');
    this.db.transaction((tx) => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS orders (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          type TEXT, 
          dateTime DATETIME, 
          foodList TEXT, 
          totalAmount DECIMAL(10, 2)
        )`,
        [],
        () => {
          console.log('Orders table created successfully');
          this.insertDummyData(); // Call inserting dummy data here
        },
        (error) => {
          console.error('Error creating orders table', error);
        }
      );
    });
  }

  // Insert dummy data into the database
  insertDummyData() {
    /*const dummyData = {
      type: 'delivery',
      dateTime: '2023-08-10 14:30:00', // Replace with your desired date and time format
      foodList: 'Americano, Latte, Croissant', // Replace with your desired food items
      totalAmount: 25.99, // Replace with your desired total amount
    };*/
  
    this.db.transaction((tx) => {
      tx.executeSql(
        'INSERT INTO orders (type, dateTime, foodList, totalAmount) VALUES (?, ?, ?, ?)',
        [delivery, '2023-08-10 14:30:00', (Americano, Latte, Croissant), 25.99],
        () => {
          console.log('Dummy order inserted successfully');
          this.fetchOrders(); // Call fetch orders here
        },
        (error) => {
          console.error('Error inserting dummy order', error);
        }
      );
    });
  }
  
  // Fetch orders from the database
  fetchOrders() {
    this.db.transaction((tx) => {
      tx.executeSql('SELECT * FROM orders', [], (tx, results) => {
        this.setState({ orders: results.rows.raw() });
      });
    });
  }

  render() {
    return (
      <View style={commonStyles.container}>
        <Text style={commonStyles.title}>Order History</Text>
        <View style={commonStyles.boxContainer}>
          <FlatList
            data={this.state.orders}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={commonStyles.orderBoxContainer}>
                <TouchableOpacity
                  onPress={() => {
                    // Navigate to Order Details screen and pass the order object as a parameter
                    this.props.navigation.navigate('OrderDetails', { order: item });
                  }}
                  style={commonStyles.orderItemContainer}
                >
                  <Text style={commonStyles.orderItemText}>
                    Order ID: {item.id}, Total: ${item.totalAmount.toFixed(2)}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          />
        </View>
      </View>
    );
  }
}
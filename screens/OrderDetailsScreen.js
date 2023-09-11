import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import SQLite from 'react-native-sqlite-storage';


class OrderDetailsScreen extends Component {

  constructor(props) {
    super(props);

    this.state = {
      orderItems: [],
    };

    this.db = SQLite.openDatabase(
      { name: 'coffeeDatabase', location: 'default' },
      this.openCallback,
      this.errorCallback
    );
  }


  componentDidMount() {
    const { route } = this.props;
    const { order } = route.params;

    this.fetchOrderItems(order);
  }


  fetchOrderItems(order) {
    this.db.transaction((tx) => {
      tx.executeSql(
        'SELECT item_name, quantity, unit_price FROM order_items WHERE order_id = ?',
        [order.id],
        (tx, results) => {
          const orderItems = [];
          const len = results.rows.length;

          for (let i = 0; i < len; i++) {
            const row = results.rows.item(i);
            orderItems.push({
              name: row.item_name,
              quantity: row.quantity,
              unit_price: row.unit_price
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
    const { order } = route.params;
    const { orderItems } = this.state;

    return (
      <ScrollView style={styles.container}>
        <Text style={styles.heading}>Order Details</Text>
        <View style={styles.orderInfo}>
        <View>
          <Text style={styles.orderAttributeText}>Order ID:</Text>
          <Text style={styles.orderValueText}>{order.id}</Text>
        </View>
        <View>
          <Text style={styles.orderAttributeText}>Order Date and Time:</Text>
          <Text style={styles.orderValueText}>{order.order_date}</Text>
        </View>
        <View>
          <Text style={styles.orderAttributeText}>Total Amount:</Text>
          <Text style={styles.orderValueText}>${order.total_amount}</Text>
        </View>
      </View>
        <Text style={styles.orderSubtitle}>Order Items:</Text>
        {orderItems.length === 0 ? (
          <Text style={styles.noOrderItemsText}>No items in this order.</Text>
        ) : (
          orderItems.map((item, itemIndex) => (
            <View key={itemIndex} style={styles.itemContainer}>
            <View style={styles.attributeContainer}>
              <Text style={styles.itemAttributeText}>Item:</Text>
              <Text style={styles.itemValueText}>{item.name}</Text>
            </View>
            <View style={styles.attributeContainer}>
              <Text style={styles.itemAttributeText}>Quantity:</Text>
              <Text style={styles.itemValueText}>{item.quantity}</Text>
            </View>
            <View style={styles.attributeContainer}>
              <Text style={styles.itemAttributeText}>Unit Price:</Text>
              <Text style={styles.itemValueText}>{item.unit_price}</Text>
            </View>
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
    backgroundColor: '#F5F5F8',
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#19364d',
    textAlign: 'center',
    borderBottomWidth: 1,
    borderColor: '#D0D0D0',
    paddingBottom: 10,
  },
  orderInfo: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 6,
    marginBottom: 20,
  },
  orderText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 15,
  },
  orderSubtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4A4A4A',
    marginBottom: 5,
    marginTop: 15,
  },
  itemContainer: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 3,
  },
  itemText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 10,
  },
  noOrderItemsText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'gray',
    textAlign: 'center',
    marginTop: 20,
  },
  orderAttributeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 1,
    flex: 0.4,
  },
  itemAttributeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    flex: 0.4,
  },
  itemValueText: {
    fontSize: 18,
    color: '#666',
    flex: 0.6,
  },
  attributeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  orderValueText: {
    fontSize: 18,
    color: '#666',
    flex: 0.6, // 60% of the container width
    marginBottom: 20,
  },
});

export default OrderDetailsScreen;
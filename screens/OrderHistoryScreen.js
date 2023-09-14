import React, { Component , useEffect} from 'react';
import { RefreshControl, View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import SQLite from 'react-native-sqlite-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Choose an appropriate icon set.
import FontAwesome from 'react-native-vector-icons/FontAwesome';  // You can install this or choose another icon library.

class OrderHistoryScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      orderHistory: [],
      isLoading: true,
      id: null,  // Initialize id state
      isRefreshing: false,
    };    

    this.db = SQLite.openDatabase(
      { name: 'coffeeDatabase', location: 'default' },
      this.openCallback,
      this.errorCallback
    );
  }
  
  componentDidMount() {
    this.fetchId();
    this.props.navigation.addListener('focus', this.handleRefresh);
  }
  componentWillUnmount() {
    this.props.navigation.removeListener('focus', this.handleRefresh);
  }
  navigateToOrderDetails(order) {
    this.props.navigation.navigate('OrderDetails', { order });
  }

  handleRefresh = () => {
    this.setState({ isRefreshing: true }, () => {
      this.fetchId();  // Re-fetch the orders on refresh
    });
  }
  
  fetchId = async () => {
    try {
      const id = await AsyncStorage.getItem('id');
      if (id) {
        this.fetchOrderHistory(id); 
         // Fetch orders after getting the id
         this.setState({ id });
      } else {
        this.setState({ isLoading: true });
      }
    } catch (error) {
      console.log('Error fetching id:', error);
      this.setState({ isLoading: false });
    }
  }
  fetchOrderHistory = async (id) => {
    try {
      this.db.transaction((tx) => {
        tx.executeSql(
          "SELECT id, order_date, total_amount FROM orders WHERE user_id = ? ORDER BY order_date DESC",
          [id],
          (tx, results) => {
            const orderHistory = [];
            const len = results.rows.length;
            for (let i = 0; i < len; i++) {
              const row = results.rows.item(i);
              orderHistory.push({
                id: row.id,
                order_date: row.order_date,
                total_amount: row.total_amount,
              });
            }
            this.setState({ orderHistory, isLoading: false, isRefreshing: false });
          },
          (tx, error) => {
            console.log('Error fetching order history:', error);
            this.setState({ isLoading: false });
          }
        );
      });
    } catch (error) {
      console.log('Error fetching order history:', error);
      this.setState({ isLoading: false });
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
        <View style={styles.orderHeader}>
          <Icon name="receipt" size={20} color="#4A4A4A" style={styles.iconStyle} />
          <Text style={styles.orderTitle}>Order ID: {order.id}</Text>
        </View>
        <View style={styles.orderDetail}>
          <FontAwesome name="clock-o" size={16} color="#666" style={styles.detailIcon} />
          <Text style={styles.orderDetailText}><Text style={styles.boldLabel}>Date and Time:</Text> {order.order_date}</Text>
        </View>
        <View style={styles.orderDetail}>
          <FontAwesome name="money" size={16} color="#666" style={styles.detailIcon} />
          <Text style={styles.orderDetailText}><Text style={styles.boldLabel}>Total:</Text> ${order.total_amount}</Text>  
        </View>
        <View style={styles.separator} />
      </TouchableOpacity>
    );
}

  render() {
    const { orderHistory, isLoading} = this.state;
    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      );
    }

    if (orderHistory.length === 0) {
      return (
        <View style={styles.noOrdersContainer}>
          <ScrollView
            style={styles.container}
            refreshControl={
          <RefreshControl
            refreshing={this.state.isRefreshing}
            onRefresh={this.handleRefresh}
          />
        }>
          <Text style={styles.noOrdersText}>No orders available yet.</Text>
          </ScrollView>
        </View>
      );
    }
    return (
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={this.state.isRefreshing}
            onRefresh={this.handleRefresh}
          />
        }
      >
        {orderHistory.map(order => this.renderOrderSummary(order))}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F8', 
  },
  loadingText: {
    fontSize: 18,
    color: '#666',
  },
  noOrdersContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F8',
  },
  noOrdersText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#888',
    textAlign: 'center',
    marginTop: 50,
  },
  orderContainer: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E1E4E8',
    borderRadius: 10,
    padding: 15,
    backgroundColor: 'white',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 6,
  },
  orderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  iconStyle: {
    marginRight: 8,
    marginBottom: 8,
  },
  orderTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2d5e86',
    marginBottom: 10,
  },
  orderDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailIcon: {
    marginRight: 8,
  },
  orderDetailText: {
    fontSize: 16,
    color: '#666', 
    marginLeft: 5,
  },
  separator: {
    height: 1,
    backgroundColor: '#E1E4E8',
    marginTop: 10,
    marginBottom: 5,
  },
  boldLabel: {
    fontWeight: 'bold',
  },
});

export default OrderHistoryScreen;

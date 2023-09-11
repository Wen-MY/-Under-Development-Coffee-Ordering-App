import React, { useState, useCallback } from 'react';
import { TouchableOpacity, View, Text, Image, Button, StyleSheet, ScrollView, Alert } from 'react-native';
import SQLite from 'react-native-sqlite-storage';
import imageMapping from '../utils/imageMapping';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

const CartScreen = ({ navigation }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCartItems = useCallback(async () => {
    const db = SQLite.openDatabase({ name: 'coffeeDatabase' });
    const id = await AsyncStorage.getItem('id');
  
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM cart WHERE user_id = ?',
        [id], // Replace with the user's ID
        (tx, results) => {
          const items = [];
          for (let i = 0; i < results.rows.length; i++) {
            const item = results.rows.item(i);
            items.push({
              id: item.id,
              name: item.item_name,
              customizations: item.item_options,
              quantity: item.quantity,
              price: item.unit_price,
            });
          }
          setCartItems(items);
          setLoading(false);
        },
        (error) => {
          console.error('Error fetching cart items', error);
          setLoading(false);
        }
      );
    });
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchCartItems();
    }, [fetchCartItems])
  );

  const removeItem = (itemId) => {
    const db = SQLite.openDatabase({ name: 'coffeeDatabase' });
    db.transaction((tx) => {
      tx.executeSql(
        'DELETE FROM cart WHERE id = ?',
        [itemId], // Remove based on the item's ID
        (tx, results) => {
          if (results.rowsAffected > 0) {
            const updatedCartItems = cartItems.filter((item) => item.id !== itemId);
            setCartItems(updatedCartItems);
          }
        },
        (error) => {
          console.error(`Error removing item with ID ${itemId} from cart`, error);
        }
      );
    });
  };
  
  const calculateTotal = () => {
    return cartItems.reduce((acc, item) => acc + item.price, 0).toFixed(2);
  };
  const handleProceedToPayment = () => {
    if (cartItems.length === 0) {
      // Cart is empty, show an alert and navigate back to the menu screen
      Alert.alert(
        'Cart is Empty',
        'Your cart is currently empty. Please add some orders to the cart.',
        [
          {
            text: 'OK',
            onPress: () => {
            },
          },
        ]
      );
    } else {
      // Cart is not empty, proceed to the payment screen
      navigation.navigate('PaymentScreen', { subtotal: calculateTotal() });
    }
  };
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
    {cartItems.length === 0 ? (
      <Text style={styles.emptyCartMessage}>Your cart is empty now.</Text>
    ) : (
      cartItems.map((item) => (
        <View key={item.id} style={styles.cartItemContainer}>
          <Image source={imageMapping[item.name]} style={styles.cartItemImage} />

          <View style={styles.cartItemInfo}>
            <Text style={styles.itemName}>{item.name}</Text>
            <View style={styles.selectedOptionsContainer}>
              <Text style={styles.selectedOptionsText}>
                {item.customizations} {/* Display stored customizations */}
              </Text>
            </View>
            <Text style={styles.unitPrice}>Quantity: {item.quantity}</Text>
            <Text style={styles.unitPrice}>Price: ${item.price.toFixed(2)}</Text>
          </View>
          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => removeItem(item.id)}
          >
            <Text style={styles.removeButtonText}>✘</Text>
          </TouchableOpacity>
        </View>
      ))
    )}
    <Text style={styles.total}>Total Price: ${calculateTotal()}</Text>
    <TouchableOpacity
      style={styles.proceedButton}
      onPress={handleProceedToPayment}
    >
      <Text style={styles.proceedButtonText}>Proceed to Payment</Text>
    </TouchableOpacity>
    </ScrollView>
  );
};

const Loading = () => (
  <View style={styles.loadingContainer}>
    <Text>Loading...</Text>
  </View>
);

const styles = StyleSheet.create({
  proceedButton: {
    backgroundColor: '#2d7f86',
    borderRadius: 25,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    height: 40, // Adjust the height as needed
  },
  proceedButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },  
  buttonText: {
    color: 'white', // Text color
    fontSize: 16, // Adjust the font size as needed
  },
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 15,
    marginTop: 10,
    marginVertical: 10,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  emptyCartMessage: {
   fontSize: 16,
  },
  cartItemImage: {
    width: 80, // Increase the width of the item image
    height: 80, // Increase the height of the item image
    marginRight: 20, // Increase the margin for better spacing
    resizeMode:"contain",
  },
  cartItemInfo: {
    flex: 1,
  },
  itemName: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#2d5e86', // Change the text color
  },
  unitPrice: {
    fontWeight: 'bold',
    fontSize: 14,
    marginTop: 10,
    color: '#555555', // Change the text color
  },
  customizations: {
    fontSize: 14,
    color: '#555', // Change the text color
  },
  total: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#19364d',
    marginTop: 20,
    borderTopWidth: 2,
    borderBottomWidth: 2,
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#fff',
  },
  removeButtonText: {
    color: 'red', // Text color
    fontSize: 25, // Adjust the font size as needed
  },
});

export default CartScreen;

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  Button,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import SQLite from 'react-native-sqlite-storage';
import imageMapping from '../utils/imageMapping';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

const CartScreen = ({ navigation }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCartItems = async () => {
    const db = SQLite.openDatabase({ name: 'coffeeDatabase' });
    const id = await AsyncStorage.getItem('id');

    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM cart WHERE user_id = ?',
        [id],
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
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchCartItems();
    }, [])
  );

  const removeItem = async(itemId) => {
    console.log('Removing item with ID', itemId);
    const id = await AsyncStorage.getItem('id');
    const db = SQLite.openDatabase({ name: 'coffeeDatabase' });

    db.transaction((tx) => {
      tx.executeSql(
        'DELETE FROM cart WHERE user_id = ? AND id = ?',
        [id, itemId], // Replace with the user's ID
        (tx, results) => {
          if (results.rowsAffected > 0) {
            console.log('Item removed successfully.');
            const updatedCartItems = cartItems.filter((item) => item.id !== itemId);
            setCartItems(updatedCartItems);
          } else {
            console.log('No item found with ID', itemId);
          }
        },
        (error) => {
          console.error(`Error removing item with ID ${itemId} from cart`, error);
        }
      );
    });
  };

  const calculateTotal = () => {
    let subtotal = 0;
    for (const item of cartItems) {
      subtotal += item.price;
    }
    return subtotal.toFixed(2);
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

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>My Cart</Text>
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
      <Button title="Proceed to Payment" onPress={handleProceedToPayment} />
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f4f4f4',
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  cartItemContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 15,
    marginTop: 10,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  cartItemImage: {
    width: 60,
    height: 90,
    marginRight: 10,
  },
  cartItemInfo: {
    flex: 1,
  },
  itemName: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  unitPrice: {
    fontWeight: 'bold',
    fontSize: 14,
    marginTop: 10,
  },
  selectedOptionsContainer: {
    marginTop: 5,
  },
  selectedOptionsText: {
    fontSize: 12, // You can adjust the font size
    color: 'gray', // You can adjust the color
  },
  total: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    marginTop: 20,
    textAlign: 'center',
    borderTopWidth: 2,
    borderBottomWidth: 2,
    marginBottom: 10,
    padding: 10,
  },
  removeButton: {
    position: 'absolute',
    top: 0, // Move the button to the top
    right: 0, // Move the button to the right
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 4,
    borderColor: '#FF6F61',
    marginRight: 2,
    marginTop: 2,
  },
  removeButtonText: {
    color: '#FF6F61',
    fontWeight: 'bold',
    fontSize: 20,
  },
});

export default CartScreen;

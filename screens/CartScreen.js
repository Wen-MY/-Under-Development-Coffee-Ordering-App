import React, { useState, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, Image, TouchableOpacity, Button, StyleSheet, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CartScreen = ({ navigation, route }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadCartItems = async () => {
    try {
      const cartItemsJSON = await AsyncStorage.getItem('cartItems');
      if (cartItemsJSON !== null) {
        setCartItems(JSON.parse(cartItemsJSON));
      }
    } catch (error) {
      console.error('Error loading cart items:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCartItems();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      loadCartItems(); // Load cart items whenever the screen comes into focus
    }, [])
  );

  const removeItem = (itemId) => {
    const newCartItems = [...cartItems];
    const itemIndex = newCartItems.findIndex((item) => item.id === itemId);
    if (itemIndex !== -1) {
      newCartItems.splice(itemIndex, 1); // Remove the item at itemIndex
      setCartItems(newCartItems);
      saveCartItems(newCartItems);
    }
  };

  const saveCartItems = async (items) => {
    try {
      await AsyncStorage.setItem('cartItems', JSON.stringify(items));
    } catch (error) {
      console.error('Error saving cart items:', error);
    }
  };

  const calculateTotal = () => {
    let subtotal = 0;
    for (const item of cartItems) {
      subtotal += item.price;
    }
    return subtotal.toFixed(2);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Your Cart</Text>
      {cartItems.map((item) => (
        <View key={item.id} style={styles.cartItemContainer}>
          <Image source={{ uri: item.image }} style={styles.cartItemImage} />
          <View style={styles.cartItemInfo}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.unitPrice}>Unit Price: ${item.price.toFixed(2)}</Text>
            <View style={styles.actionRow}>
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removeItem(item.id)}
              >
                <Text style={styles.removeButtonText}>Remove</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ))}
      <Text style={styles.total}>Total for all items: ${calculateTotal()}</Text>
      <Button
      title="Proceed to Payment"
      onPress={() => {
        navigation.navigate('PaymentScreen', { subtotal: calculateTotal(), cartItems });
      }}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f4f4f4',
    padding: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  cartItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
  },
  cartItemImage: {
    width: 60,
    height: 60,
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
    marginTop: 5,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  smallButton: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'lightgray',
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  quantityText: {
    fontSize: 16,
  },
  quantityMargin: {
    marginHorizontal: 10,
  },
  removeButton: {
    width: 75,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FF6F61',
    paddingHorizontal: 5,
    paddingVertical: 5,
    borderRadius: 4,
    marginLeft: 5,
  },
  removeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  totalPrice: {
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 10,
  },
  total: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    textAlign: 'center',
  },
});

export default CartScreen;

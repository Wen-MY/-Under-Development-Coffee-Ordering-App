import React, { useState, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, Image, TouchableOpacity, Button, StyleSheet, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CartScreen = ({ navigation }) => {
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

  const increaseQuantity = (index) => {
    const newCartItems = [...cartItems];
    newCartItems[index].quantity += 1;
    setCartItems(newCartItems);
  };

   const decreaseQuantity = (index) => {
    if (cartItems[index].quantity > 1) {
      const newCartItems = [...cartItems];
      newCartItems[index].quantity -= 1;
      setCartItems(newCartItems);
    }
  };

  const removeItem = (itemId) => {
    const newCartItems = cartItems.filter((item) => item.id !== itemId);
    setCartItems(newCartItems);
  };

  const calculateTotal = () => {
    let total = 0;
    for (let i = 0; i < cartItems.length; i++) {
      total += cartItems[i].price * cartItems[i].quantity;
    }
    return total;
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Your Cart</Text>
      {cartItems.map((item, index) => (
        <View key={index} style={styles.cartItemContainer}>
          <Image source={item.image} style={styles.cartItemImage} />
          <View style={styles.cartItemInfo}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.unitPrice}>Unit Price: ${item.price.toFixed(2)}</Text>
            <View style={styles.actionRow}>
              <TouchableOpacity
                style={styles.smallButton}
                onPress={() => decreaseQuantity(index)}
              >
                <Text style={styles.buttonText}>-</Text>
              </TouchableOpacity>
              <Text style={[styles.quantityText, styles.quantityMargin]}>
                {item.quantity}
              </Text>
              <TouchableOpacity
                style={styles.smallButton}
                onPress={() => increaseQuantity(index)}
              >
                <Text style={styles.buttonText}>+</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removeItem(index)}
              >
                <Text style={styles.removeButtonText}>Remove</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.totalPrice}>
              Total Price: ${(item.price * item.quantity).toFixed(2)}
            </Text>
          </View>
        </View>
      ))}
      <Text style={styles.total}>Total for all items: ${calculateTotal().toFixed(2)}</Text>
      <Button
        title="Proceed to Payment"
        onPress={() => {
          navigation.navigate('PaymentScreen', { cartItems });
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

import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, Button, StyleSheet,ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const latteImage = require('../assets/CoffeeImage/Latte.png');
const americanoImage = require('../assets/CoffeeImage/Americano.png');
const coffeeItems = [
  {
    "name": "Latte",
    "image": latteImage,
    "price": 4.49,
    "type": "Classics",
    "milk": "None",
    "temperature":"Hot",
    "topping":"None",
    "whipped_cream": "None",
    "shots": 1
  },
  {
    "name": "Americano",
    "image": americanoImage,
    "price": 3.99,
    "type": "Classics",
    "milk": "None",
    "temperature":"Hot",
    "topping":"None",
    "whipped_cream": "None",
    "shots": 1
  }
];
const CartScreen = ({ navigation }) => {
  const [cartItems, setCartItems] = useState([]);

  const addItemToCart = (index) => {
    const itemName = coffeeItems[index].name;
    const existingItemIndex = cartItems.findIndex((item) => item.name === itemName);
  
    if (existingItemIndex !== -1) {
      // If the item already exists in the cart, update its quantity
      const newCartItems = [...cartItems];
      newCartItems[existingItemIndex].quantity += 1;
      setCartItems(newCartItems);
    } else {
      // If it's a new item, add it to the cart with a quantity of 1
      const newCartItem = { ...coffeeItems[index], quantity: 1 };
      setCartItems([...cartItems, newCartItem]);
    }
  };

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

  const removeItem = (index) => {
    const newCartItems = [...cartItems];
    newCartItems.splice(index, 1);
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
      <Text style={styles.heading}>Coffee Menu</Text>
      {coffeeItems.map((item, index) => (
        <View key={index} style={styles.itemContainer}>
          <Image source={item.image} style={styles.itemImage} />
          <View style={styles.itemInfo}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemDescription}>{item.description}</Text>
            <Text style={styles.price}>Price: ${item.price.toFixed(2)}</Text>
            <TouchableOpacity onPress={() => addItemToCart(index)}>
              <Text style={styles.addButton}>Add to Cart</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}

      <Text style={styles.heading}>Your Cart</Text>
      {cartItems.map((item, index) => (
        <View key={index} style={styles.cartItemContainer}>
          <Image source={item.image} style={styles.cartItemImage} />
          <View style={styles.cartItemInfo}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemDescription}>{item.description}</Text>
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
        onPress={async () => {
          await AsyncStorage.setItem('cartItems', JSON.stringify(cartItems));
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
  itemContainer: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemImage: {
    width: 70,
    height: 70,
    marginRight: 10,
  },
  itemName: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  itemDescription: {
    fontSize: 14,
  },
  price: {
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 5,
  },
  addButton: {
    backgroundColor: '#FF6F61',
    color: 'white',
    padding: 5,
    borderRadius: 5,
    marginTop: 10,
    textAlign: 'center',
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
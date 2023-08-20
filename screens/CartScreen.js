import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const latteImage = require('../assets/CoffeeImage/dirty_latte.png');
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
    const newCartItem = { ...coffeeItems[index], quantity: 1 };
    setCartItems([...cartItems, newCartItem]);
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
    <View style={styles.container}>
      <Text style={styles.heading}>Testing</Text>
      {coffeeItems.map((item, index) => (
        <View key={index} style={styles.itemContainer}>
          <Image source={item.image} style={styles.itemImage} />
          <View style={styles.itemInfo}>
            <Text>{item.name}</Text>
            <Text>{item.description}</Text>
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
            <Text>{item.name}</Text>
            <Text>{item.description}</Text>
            <Text style={styles.unitPrice}>
              Unit Price: ${item.price.toFixed(2)}
            </Text>
            <View style={styles.actionRow}>
              <TouchableOpacity
                style={styles.smallButton}
                onPress={() => decreaseQuantity(index)}
              >
                <Text style={styles.buttonText}>-</Text>
              </TouchableOpacity>
              <Text style={[styles.quantityText, styles.quantityMargin]}>{item.quantity}</Text>
              <TouchableOpacity
                style={styles.smallButton}
                onPress={() => increaseQuantity(index)}
              >
                <Text style={styles.buttonText}>+</Text>
              </TouchableOpacity>
              <View style={styles.spacer} />
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f4f4f4',
    padding: 20,
    borderRadius: 8,
    margin: 20,
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
  price: {
    fontWeight: 'bold',
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
 

  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  spacer: {
    width: 20,
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
  total: {
    fontWeight: 'bold',
    marginTop: 20, // Add margin to separate from the button
  },
    removeButton: {
    width: 75,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'red',
    paddingHorizontal: 5,
    paddingVertical: 5,
    borderRadius: 4,
    marginLeft: 5, // Add some space between the buttons
  },
  removeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  quantityMargin: {
    marginHorizontal: 10, // Add horizontal margin to quantity text
  },
  
});


export default CartScreen;
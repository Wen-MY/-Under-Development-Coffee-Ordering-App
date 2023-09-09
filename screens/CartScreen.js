import React, { useState, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, Image, TouchableOpacity, Button, StyleSheet, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import imageMapping from '../utils/imageMapping';
import TrashIcon from 'react-native-vector-icons/Feather';

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
      <Text style={styles.heading}>My Cart</Text>
      {cartItems.map((item) => (
        <View key={item.id} style={styles.cartItemContainer}>
          <Image source={imageMapping[item.name]} style={styles.cartItemImage} />
  
          <View style={styles.cartItemInfo}>
            <Text style={styles.itemName}>{item.name}</Text>
  
            {item.customizations && (
              <Text style={styles.customizations}> {item.customizations}</Text>
            )}
            <Text style={styles.unitPrice}>Price: ${item.price.toFixed(2)}</Text>
          </View>
  
          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => removeItem(item.id)}
          >
            <Text style={styles.removeButtonText}>✘</Text>
          </TouchableOpacity>
        </View>
      ))}
      <Text style={styles.total}>Total Price: ${calculateTotal()}</Text>
      <Button
<<<<<<< HEAD
      title="Proceed to Payment"
      onPress={() => {
        navigation.navigate('PaymentScreen', { subtotal: calculateTotal(), cartItems });
      }}
=======
        title="Proceed to Payment"
        onPress={() => {
          navigation.navigate('PaymentScreen', { subtotal: calculateTotal() });
        }}
>>>>>>> b3e5154bcac568e1ff2c2a63d28468b4fa38fa2c
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
    alignItems: 'flex-start',
    backgroundColor: 'white', // Background color
    padding: 15,
    borderRadius: 15,
    marginTop: 10,
    shadowColor: '#000000', // Shadow color
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2, // Shadow opacity
    shadowRadius: 4,     // Shadow radius
    elevation: 5,        // Android shadow elevation
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
    position: 'absolute',
    top: 0, // Move the button to the top
    right: 0, // Move the button to the right
    paddingHorizontal: 10,
    paddingVertical: 5,
    
    borderRadius: 4,
    borderColor: '#FF6F61',
    marginRight:2,
    marginTop:2,
  },
  removeButtonText: {
    color: '#FF6F61',
    fontWeight: 'bold',
    fontSize: 20,
  },
  totalPrice: {
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 10,
  },
  total: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    marginTop: 20,
    textAlign: 'center',
    borderTopWidth: 2,    // Border on top
    borderBottomWidth: 2, // Border on bottom
    marginBottom:10,
    padding:10,
  },
  
});

export default CartScreen;

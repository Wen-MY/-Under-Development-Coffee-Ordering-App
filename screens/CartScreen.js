import React, { useState, useEffect } from 'react';
import { View, Text, Image, Button, StyleSheet, ScrollView } from 'react-native';
import SQLite from 'react-native-sqlite-storage';
import imageMapping from '../utils/imageMapping';
import { useFocusEffect } from '@react-navigation/native'; // Import useFocusEffect

const CartScreen = ({ navigation }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCartItems = () => {
    const db = SQLite.openDatabase({ name: 'coffeeDatabase' });

    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM cart WHERE user_id = ?',
        [1], // Replace with the user's ID
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
      // Fetch cart items every time the screen comes into focus
      fetchCartItems();
    }, [])
  );

  const removeItem = (itemId) => {
    const db = SQLite.openDatabase({ name: 'coffeeDatabase' });

    db.transaction((tx) => {
      tx.executeSql(
        'DELETE FROM cart WHERE user_id = ? AND id = ?',
        [1, itemId], // Replace with the user's ID
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
    let subtotal = 0;
    for (const item of cartItems) {
      subtotal += item.price;
    }
    return subtotal.toFixed(2);
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
      <Text style={styles.heading}>My Cart</Text>
      {cartItems.map((item) => (
        <View key={item.id} style={styles.cartItemContainer}>
          <Image source={imageMapping[item.name]} style={styles.cartItemImage} />

          <View style={styles.cartItemInfo}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.unitPrice}>Quantity: {item.quantity}</Text>
            <Text style={styles.unitPrice}>Price: ${item.price.toFixed(2)}</Text>
          </View>

          <Button
            title="Remove"
            onPress={() => removeItem(item.id)}
          />
        </View>
      ))}
      <Text style={styles.total}>Total Price: ${calculateTotal()}</Text>
      <Button
        title="Proceed to Payment"
        onPress={() => {
          navigation.navigate('PaymentScreen', { subtotal: calculateTotal() });
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
  customizations: {
    fontSize: 14,
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
});

export default CartScreen;

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert
} from 'react-native';
import { RadioButton, Checkbox } from 'react-native-paper';
import SQLite from 'react-native-sqlite-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import imageMapping from '../utils/imageMapping';

const CoffeeDetailScreen = ({ route, navigation }) => {
  const { itemId, cartItems, setCartItems } = route.params;

  const [coffeeDetails, setCoffeeDetails] = useState({
    name: '',
    basePrice: 0,
    type: '',
    description: '',
  });

  const [iceLevel, setIceLevel] = useState('Default Ice');
  const [whippedCream, setWhippedCream] = useState(false);
  const [sweetness, setSweetness] = useState('Default Sugar');
  const [quantity, setQuantity] = useState(1);
  

  useEffect(() => {
    const db = SQLite.openDatabase({ name: 'coffeeDatabase' });

    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM items WHERE id = ?',
        [itemId],
        (tx, results) => {
          const item = results.rows.item(0);
          setCoffeeDetails({
            name: item.name,
            basePrice: item.base_price,
            type: item.type,
            description: item.description,
          });
        },
        (error) => {
          console.log('Error fetching item details', error);
        }
      );
    });
  }, [itemId]);

  const clearCart = async () => {
    try {
      await AsyncStorage.removeItem('cartItems');
      Alert.alert('Cart Cleared', 'Your cart has been cleared successfully.');
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  const calculatePrice = () => {
    let price = parseFloat(coffeeDetails.basePrice);

    if (whippedCream) {
      price += 0.7;
    }

    return (price * quantity).toFixed(2);
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const addToCart = async () => {
    const price = calculatePrice();

    const coffeeItem = {
      ...coffeeDetails,
      iceLevel,
      whippedCream,
      sweetness,
      customizations: `${iceLevel} | ${sweetness} | ${whippedCream ? 'Whipped Cream' : ''}`,
      price: parseFloat(price),
    };

    try {
      const existingCartItemsJSON = await AsyncStorage.getItem('cartItems');
      let existingCartItems = [];

      if (existingCartItemsJSON) {
        existingCartItems = JSON.parse(existingCartItemsJSON);
      }

      existingCartItems.push(coffeeItem);

      await AsyncStorage.setItem('cartItems', JSON.stringify(existingCartItems));
      navigation.navigate('Your Cart');
    } catch (error) {
      console.error('Error adding item to cart:', error);
    }
  };
  
  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.name}>{coffeeDetails.name}</Text>

        <Image
          source={imageMapping[coffeeDetails.name]}
          style={styles.coffeeImage}
        />

        <Text style={styles.description}>{coffeeDetails.description}</Text>

        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Ice Level</Text>
          <View style={styles.optionRow}>
            <RadioButton
              value="Default Ice"
              status={iceLevel === 'Default Ice' ? 'checked' : 'unchecked'}
              onPress={() => setIceLevel('Default Ice')}
            />
            <Text>Default Ice</Text>
          </View>
          <View style={styles.optionRow}>
            <RadioButton
              value="Less Ice"
              status={iceLevel === 'Less Ice' ? 'checked' : 'unchecked'}
              onPress={() => setIceLevel('Less Ice')}
            />
            <Text>Less Ice</Text>
          </View>
          <View style={styles.optionRow}>
            <RadioButton
              value="No Ice"
              status={iceLevel === 'No Ice' ? 'checked' : 'unchecked'}
              onPress={() => setIceLevel('No Ice')}
            />
            <Text>No Ice</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Sugar Level</Text>
          <View style={styles.optionRow}>
            <RadioButton
              value="Default Sugar"
              status={sweetness === 'Default Sugar' ? 'checked' : 'unchecked'}
              onPress={() => setSweetness('Default Sugar')}
            />
            <Text>Default Sugar</Text>
          </View>
          <View style={styles.optionRow}>
            <RadioButton
              value="Less Sugar"
              status={sweetness === 'Less Sugar' ? 'checked' : 'unchecked'}
              onPress={() => setSweetness('Less Sugar')}
            />
            <Text>Less Sugar</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Whipped Cream</Text>
          <View style={styles.optionRow}>
            <Checkbox
              status={whippedCream ? 'checked' : 'unchecked'}
              onPress={() => setWhippedCream(!whippedCream)}
            />
            <Text>Add Whipped Cream</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.priceContainer}>
        <View style={styles.priceSection}>
          <Text style={styles.priceButtonLabel}>Price: RM {calculatePrice()}</Text>
          <View style={styles.quantityContainer}>
            <TouchableOpacity onPress={decreaseQuantity} style={styles.quantityButton}>
              <Text style={styles.quantityButtonText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.quantityText}>{quantity}</Text>
            <TouchableOpacity onPress={increaseQuantity} style={styles.quantityButton}>
              <Text style={styles.quantityButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity onPress={addToCart} style={styles.priceButton}>
          <Text style={styles.priceButtonLabel}>Add to Cart</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={clearCart} style={styles.clearCartButton}>
          <Text style={styles.clearCartButtonText}>Clear Cart</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  coffeeImage: {
    width: 200,
    height: 350,
    marginBottom: 20,
    alignSelf: 'center',
  },
  description: {
    fontSize: 16,
    marginHorizontal: 20,
    marginBottom: 20,
    textAlign: 'center',
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  priceButton: {
    padding: 10,
    alignItems: 'center',
    backgroundColor: '#43A047',
    borderRadius: 8,
  },
  priceButtonLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 5,
    marginBottom: 5,
  },
  priceButtonPrice: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  priceSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceContainer: {
    backgroundColor: 'lightgrey',
    padding: 8, // Updated padding
    borderRadius: 8,
    marginBottom: 16,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 20, // Adjust the margin to your preference
    marginRight: 20, // Adjust the margin to your preference
  },
  quantityText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
    marginLeft: 10,
  },
  quantityButton: {
    backgroundColor: '#43A047',
    borderRadius: 20,
    padding: 10, // Updated padding
    margin: 5, // Adjust the margin to your preference
  },
  quantityButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default CoffeeDetailScreen;


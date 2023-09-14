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
import { useNavigation } from '@react-navigation/native';

const CoffeeDetailScreen = ({route}) => {
  const { itemId } = route.params;
  const navigation = useNavigation();

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
            customizations: item.item_options, // This is the stored options
          });
        },
        (error) => {
          console.log('Error fetching item details', error);
        }
      );
    });
  }, [itemId]);

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
    try {
      const current_user = await AsyncStorage.getItem('id');
      if (current_user !== null) {
        const db = SQLite.openDatabase({ name: 'coffeeDatabase' });
        const itemOptions = `${iceLevel} | ${sweetness} | ${
          whippedCream ? 'Whipped Cream' : ''
        }`; // Construct the item options string
        db.transaction((tx) => {
          tx.executeSql(
            'INSERT INTO cart(user_id,item_name,item_options,quantity,unit_price) VALUES (?,?,?,?,?)',
            [
              current_user,
              coffeeDetails.name,
              itemOptions,
              quantity,
              calculatePrice(),
            ],
            (tx, results) => {
              Alert.alert('Success', `${coffeeDetails.name} added to cart successfully.`, [
                {
                  text: 'OK',
                  onPress: () => {
                    // Navigate back to the menu screen after acknowledging the alert
                    navigation.goBack(); // You can use any navigation method here based on your navigation setup
                  },
                },
              ]);
            },
            (error) => {
              console.log('Error inserting ' + coffeeDetails.name + ' into cart : ', error);
            }
          );
        });
      } else {
        // Navigate the user to the login page or perform any other action you want.
        // You can use navigation props here.
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.title}>{coffeeDetails.name}</Text>

        <View style={styles.whiteContainer}>
        <Image
          source={imageMapping[coffeeDetails.name]}
          style={styles.coffeeImage}
        />

        <Text style={styles.description}>{coffeeDetails.description}</Text>
      </View>

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

        <View style={styles.footerContainer}>
          <View style={styles.priceSection}>
          <Text style={[styles.valueText, styles.priceDisplay]}>Price: RM {calculatePrice()}</Text>
            <View style={styles.quantityContainer}>
              <TouchableOpacity onPress={decreaseQuantity} style={styles.quantityButton}>
                <Text style={styles.quantityButtonText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.valueText}>{quantity}</Text>
              <TouchableOpacity onPress={increaseQuantity} style={styles.quantityButton}>
                <Text style={styles.quantityButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity onPress={addToCart} style={styles.addToCartButton}>
            <Text style={styles.addToCartButtonText}>Add to Cart</Text>
          </TouchableOpacity>
        </View>
        </View>
        );
      };

      const styles = StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: '#b3e2e5',
          paddingHorizontal: 20,
          paddingTop: 20,
        },
        footerContainer: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#f3f7f7',
          padding: 16,
          borderRadius: 8,
          marginBottom: 16,
        },
        addToCartButton: {
          backgroundColor: '#4085bf',
          borderRadius: 8,
          padding: 8, // Reduced padding to make the button smaller
          paddingHorizontal: 12, // Adjusted padding for a more compact button
        },
        addToCartButtonText: {
          fontSize: 14,  // Reduced font size for a more compact button
          fontWeight: 'bold',
          color: 'white',
          textAlign: 'center',
        },
        priceSection: {
          flexDirection: 'row',
          alignItems: 'center',
        },
        quantityContainer: {
          flexDirection: 'row',
          alignItems: 'center',
          marginLeft: 10,  // Adjusted margin for spacing
          marginRight: 10,
        },
        quantityButton: {
          backgroundColor: '#4085bf',
          borderRadius: 15, // Smaller, rounded button
          paddingHorizontal: 8, // Reduced padding for a smaller button
          paddingBottom: 1,
          margin: 5,
        },
        quantityButtonText: {
          fontSize: 15,  // Slightly reduced font size
          fontWeight: 'bold',
          color: 'white',
        },
        title: {
          fontSize: 28,
          color: '#19494d',
          fontFamily: 'Montserrat-Regular',
          marginBottom: 15,
          textAlign: 'center',
        },
        subtitle: {
          fontSize: 16,
          fontFamily: 'Montserrat-Regular',
          color: '#888',
          marginBottom: 20,
          textAlign: 'center',
        },
        valueText: {
          fontSize: 16,
          fontFamily: 'Montserrat-Regular',
          color: '#888',
          margin: 5,
          textAlign: 'center',
        },
        coffeeImage: {
          width: 200,
          height: 350,
          marginBottom: 20,
          alignSelf: 'center',
          backgroundColor: 'white',
        },
        description: {
          fontSize: 16,
          marginHorizontal: 20,
          marginBottom: 20,
          textAlign: 'center',
        },
        section: {
          marginBottom: 25,
        },
        sectionHeader: {
          fontSize: 20,
          fontWeight: 'bold',
          marginBottom: 10,
          color: '#19354d',
        },
        optionRow: {
          flexDirection: 'row',
          alignItems: 'center',
        },
        priceButton: {
          padding: 10,
          alignItems: 'center',
          backgroundColor: '#43A047',
          borderRadius: 8,
        },
        quantityText: {
          fontSize: 13,
          fontWeight: 'bold',
          marginRight: 10,
          marginLeft: 10,
        },
        whiteContainer: {
          backgroundColor: 'white',
          borderRadius: 15,
          padding: 20,
          marginVertical: 15,
          alignItems: 'center',
        },
        priceDisplay: {
          marginTop: 5,
          marginRight: 10,
        },
      });      

export default CoffeeDetailScreen;
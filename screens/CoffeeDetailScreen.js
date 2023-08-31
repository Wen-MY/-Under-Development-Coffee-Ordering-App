import React, { useState,useEffect } from 'react';
import { TouchableOpacity, View, Text, Image, StyleSheet, ScrollView } from 'react-native';
import { RadioButton, Checkbox, configureFonts } from 'react-native-paper';
import imageMapping from "../utils/imageMapping";
import SQLite from 'react-native-sqlite-storage';
import { commonStyles } from '../style/CommonStyle';

const CoffeeDetailScreen = ({route}) => {
  const {itemId} = route.params;
  const [coffeeDetails, setCoffeeDetails] = useState({
    name: '',
    basePrice: 0,
    type: '',
    description: '',
  });
  const [iceLevel, setIceLevel] = useState('Default Ice');
  const [whippedCream, setWhippedCream] = useState(false);
  const [sweetness, setSweetness] = useState('Default Sugar');
  useEffect(() => {
    const db = SQLite.openDatabase({ name: 'coffeeDatabase'});

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
  const calculatePrice = () => {
    let price = parseFloat(coffeeDetails.basePrice); // Base price
    // Additional charges based on options
    if (whippedCream) {
      price += 0.7;
    }

    return price.toFixed(2);
  };

  const handlePlaceOrder = () => {
    // Place order logic
    // You can navigate to a checkout screen or perform any desired action
  };

  return (
    <View style={styles.container}>
    <ScrollView >
      <Text style={styles.name}>{coffeeDetails.name}</Text>

      <Image 
        source={imageMapping[coffeeDetails.name]}
        style={styles.coffeeImage}
      />

      <Text style={styles.description}>
        {coffeeDetails.description}
      </Text>

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

    {/* Price button */}
    <View style ={styles.priceContainer}>
      <View style={styles.priceSection}>
        <Text style={styles.priceButtonPrice}>RM {calculatePrice()}</Text>
        <TouchableOpacity onPress={handlePlaceOrder} style={styles.priceButton}>
          <Text style={styles.priceButtonLabel}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
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
    //resizeMode: 'center',
    alignSelf: 'center'
  },
  description: {
    fontSize: 16,
    marginHorizontal: 20,
    marginBottom:20,
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
    padding : 10,
    alignItems: 'center',
    backgroundColor: "#43A047",
    borderRadius: 8, 
  },
  priceButtonLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color : 'white'
  },
  priceButtonPrice: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  priceSection: {
    flexDirection: 'row', // Arrange items in a row
    justifyContent: 'space-between', // Align items with space between
    alignItems: 'center', // Align items vertically
  },
  priceContainer: {
    backgroundColor: 'lightgrey', 
    padding: 8, 
    borderRadius: 8, 
    marginBottom: 16
  }
});

export default CoffeeDetailScreen;

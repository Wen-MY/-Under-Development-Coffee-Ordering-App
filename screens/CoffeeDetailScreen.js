import React, { useState } from 'react';
import { TouchableOpacity, View, Text, Image, StyleSheet, ScrollView } from 'react-native';
import { RadioButton, Checkbox } from 'react-native-paper';

const CoffeeDetailScreen = () => {
  const [iceLevel, setIceLevel] = useState('Default Ice');
  const [whippedCream, setWhippedCream] = useState(false);
  const [sweetness, setSweetness] = useState('Default Sugar');

  const calculatePrice = () => {
    let price = 3.99; // Base price

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
    <ScrollView style={styles.container}>
      <Text style={styles.name}>Coffee Name</Text>

      <Image 
        source={require('../assets/CoffeeImage/black.jpg')}
        style={styles.coffeeImage}
      />

      <Text style={styles.description}>
        A delicious cup of coffee with rich flavor and aroma.
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

      {/* Price button */}
      <TouchableOpacity
        style={styles.priceButton}
        onPress={handlePlaceOrder}
      >
        <Text style={styles.priceButtonLabel}>Place Order</Text>
        <Text style={styles.priceButtonPrice}>RM {calculatePrice()}</Text>
      </TouchableOpacity>
      <View style={styles.spacingBelowButton} />
    </ScrollView>
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
    width: '100%',
    height: 200,
    marginBottom: 20,
    resizeMode: 'cover',
  },
  description: {
    fontSize: 16,
    marginBottom: 20,
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    paddingHorizontal: 16,
    paddingVertical: 20,
    bottom: 0,
    left: 0,
    right: 0,
  },
  priceButtonLabel: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  priceButtonPrice: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  spacingBelowButton: {
    height: 20, // Adjust the value as needed
  },
});

export default CoffeeDetailScreen;

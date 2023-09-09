import React, { Component } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView ,Image } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const VisaIcon = require('../assets/CardImage/visa_icon.png');
const MasterCardIcon = require('../assets/CardImage/mastercard_icon.png');
const CirrusIcon = require('../assets/CardImage/cirrus_icon.png');
const MaestroIcon = require('../assets/CardImage/maestro_icon.png');
const PaypalIcon = require('../assets/CardImage/paypal_icon.png');
const EbayIcon = require('../assets/CardImage/ebay_icon.png');

class PaymentScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      firstName: '',
      lastName: '',
      cardNumber: '',
      cvv: '',
      paymentMethod: 'MasterCard', // Default payment method
      promocode: '',
      validUntilMonth: '01', // Default valid until month
      validUntilYear: '2023', // Default valid until year
      storedCartItems: [],
    };
  }
  

  handlePayment = async () => {
    if (this.validateForm()) {
      const { promocode, storedCartItems } = this.state;
      const subtotal = parseFloat(this.props.route.params.subtotal); // Convert subtotal to a floating-point number
      const deliveryFee = 5.0;
      let promocodeAmount = 0; // Initialize promocodeAmount to 0
      if (this.state.promocode === '123456') {
        promocodeAmount = 5.0; // Apply $5.00 discount if promocode is valid
      }
      const totalAmount = subtotal + deliveryFee - promocodeAmount;
      const formattedTotalAmount = totalAmount.toFixed(2);
      
      
      // Create an order object with relevant details
      const order = {
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        cardNumber: this.state.cardNumber,
        cvv: this.state.cvv,
        paymentMethod: this.state.paymentMethod,
        promocode,
        validUntilMonth: this.state.validUntilMonth,
        validUntilYear: this.state.validUntilYear,
        subtotal,
        deliveryFee,
        promocodeAmount,
        totalAmount,
        orderItems: storedCartItems,
      };
  
      try {
        // Save the order details in AsyncStorage
        await AsyncStorage.setItem('orderHistory', JSON.stringify(order));
  
        // Clear the cart (optional)
        await AsyncStorage.removeItem('cartItems');
  
        // Navigate to the OrderHistory screen and pass the order object
  //    this.props.navigation.navigate('OrderHistoryScreen', { order });

        // Inside the handlePayment method
        this.props.navigation.navigate('SuccessOrderScreen', {
          totalAmount: formattedTotalAmount,
          paymentMethod: this.state.paymentMethod, // Pass the payment method
        });

      } catch (error) {
        console.error('Error saving order details:', error);
      }
    } else {
      alert('Please fill out all fields correctly.');
    }
  };

  validateForm = () => {
    const { firstName, lastName, cardNumber, cvv } = this.state;
    const cardNumberRegex = /^[0-9]{16}$/; // 16-digit number
    const cvvRegex = /^[0-9]{4}$/; // 4-digit number

    return (
      firstName &&
      lastName &&
      cardNumberRegex.test(cardNumber) && // Validate card number
      cvvRegex.test(cvv) // Validate CVV
    );
  };

  async componentDidMount() {
    try {
      const storedCartItems = await AsyncStorage.getItem('cartItems');
      if (storedCartItems !== null) {
        this.setState({ storedCartItems: JSON.parse(storedCartItems) });
      }
    } catch (error) {
      console.error('Error retrieving cart items:', error);
    }
  }

  render() {
    const subtotal = parseFloat(this.props.route.params.subtotal); // Convert subtotal to a floating-point number
    const deliveryFee = 5.0;
    let promocodeAmount = 0; // Initialize promocodeAmount to 0
    if (this.state.promocode === '123456') {
      promocodeAmount = 5.0; // Apply $5.00 discount if promocode is valid
    }
    const totalAmount = subtotal + deliveryFee - promocodeAmount;
    const formattedTotalAmount = totalAmount.toFixed(2);
    

    return (
      <ScrollView style={styles.container}>
        <Text style={styles.heading}>Order Confirmation</Text>

        <View style={styles.paymentMethodContainer}>
          <Text style={styles.label}>Payment Method</Text>         
          <Picker
            selectedValue={this.state.paymentMethod}
            onValueChange={(itemValue) => this.setState({ paymentMethod: itemValue })}
            style={styles.input}
          >
            <Picker.Item label="MasterCard" value="MasterCard" />
            <Picker.Item label="Visa" value="Visa" />
            <Picker.Item label="eBay" value="eBay" />
            <Picker.Item label="PayPal" value="PayPal" />
            <Picker.Item label="Maestro" value="Maestro" />
            <Picker.Item label="Cirrus" value="Cirrus" />
          </Picker>
          
          <View style={styles.cardIconsRow}>
          <Image source={MasterCardIcon} style={styles.cardIcon} />
          <Image source={VisaIcon} style={styles.cardIcon} />
          <Image source={EbayIcon} style={styles.cardIcon} />
          <Image source={PaypalIcon} style={styles.cardIcon} />
          <Image source={MaestroIcon} style={styles.cardIcon} />
          <Image source={CirrusIcon} style={styles.cardIcon} />
          </View>
        </View>
        <Text style={styles.heading1}>Card Information</Text>
        <Text style={styles.label}>First Name</Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => this.setState({ firstName: text })}
        />

        <Text style={styles.label}>Last Name</Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => this.setState({ lastName: text })}
        />

        <Text style={styles.label}>Card Number</Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => this.setState({ cardNumber: text })}
          maxLength={16} // Limit to 16 characters
          keyboardType="numeric" // Show numeric keyboard
        />

        <Text style={styles.label}>CVV</Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => this.setState({ cvv: text })}
          maxLength={4} // Limit to 4 characters
          keyboardType="numeric" // Show numeric keyboard
        />

        <Text style={styles.label}>Expiry Date</Text>
        <View style={styles.pickerContainer}>
          <View style={styles.pickerColumn}>
            <Picker
              selectedValue={this.state.validUntilMonth}
              onValueChange={(itemValue) => this.setState({ validUntilMonth: itemValue })}
              style={{ flex: 1 }}
            >
              <Picker.Item label="01 - January" value="01" />
              <Picker.Item label="02 - Febuary" value="02" />
              <Picker.Item label="03 - March" value="03" />
              <Picker.Item label="04 - April" value="04" />
              <Picker.Item label="05 - May" value="05" />
              <Picker.Item label="06 - June" value="06" />
              <Picker.Item label="07 - July" value="07" />
              <Picker.Item label="08 - August" value="08" />
              <Picker.Item label="09 - September" value="09" />
              <Picker.Item label="10 - October" value="10" />
              <Picker.Item label="11 - November" value="11" />
              <Picker.Item label="12 - December" value="12" />
            </Picker>
          </View>

          <View style={styles.pickerColumn}>
            <Picker
              selectedValue={this.state.validUntilYear}
              onValueChange={(itemValue) => this.setState({ validUntilYear: itemValue })}
              style={{ flex: 1 }}
            >
              <Picker.Item label="2023" value="2023" />
              <Picker.Item label="2024" value="2024" />
              <Picker.Item label="2025" value="2025" />
              <Picker.Item label="2026" value="2026" />
              <Picker.Item label="2027" value="2027" />
              <Picker.Item label="2028" value="2028" />
              <Picker.Item label="2029" value="2029" />
              <Picker.Item label="2030" value="2030" />
            </Picker>
          </View>
        </View>

        <Text style={styles.label}>Promocode Code</Text>
        <TextInput
          style={styles.input}
          placeholder="XXXXXX"
          onChangeText={(text) => this.setState({ promocode: text })}
        />

        <View style={styles.paymentContainer}>
          <Text style={styles.heading1}>Payment Details</Text>
          <Text>Subtotal: ${subtotal}</Text>
          <Text>Delivery Fee: ${deliveryFee.toFixed(2)}</Text>
          <Text>Discount: ${promocodeAmount.toFixed(2)}</Text>
          <Text>Total: ${totalAmount.toFixed(2)}</Text>
        </View>


        <Button title="Make Payment" onPress={this.handlePayment} />
        <View style={styles.bottomSpace} />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#4A4A4A',
  },
  heading1: {
    fontSize: 18,
    marginBottom: 10,
    marginTop: 10,
    color: '#4A4A4A',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#4A4A4A',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    padding: 5,
    borderRadius: 8,
  },
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  pickerColumn: {
    flex: 1,
    marginLeft: 5,
  },
  paymentContainer: {
    marginTop: 10,
    paddingTop: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: 'lightgray',
    borderRadius: 8,
    backgroundColor: 'white', // Background color of the payment details box
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 0, // Set both width and height to 0 for shadow on all sides
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    marginBottom: 15,
  },
  
  bottomSpace: {
    height: 40,
  },
  paymentMethodContainer: {
    marginBottom: 20, // Add margin to separate the payment method section from other elements
    borderWidth: 1, // Add a border
    borderColor: 'lightgray', // Border color
    borderRadius: 8, // Border radius for rounded corners
    padding: 10, // Padding inside the container
  },
  cardIconsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10, // Adjust the margin as needed
  },
  cardIconsRow: {
    flexDirection: 'row', // Create a row layout for card icons
    alignItems: 'center', // Align card icons vertically in the center
    marginBottom: 10, // Add some spacing between card icons and picker
  },

  cardIcon: {
    width: 40, // Adjust the width as needed
    height: 25, // Adjust the height as needed
    marginRight: 10, // Add some spacing between card icons
  },
});

export default PaymentScreen;

   

import React, { Component } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView ,Image } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
//const VisaIcon = '../assets/CardImg/visa_icon.png';
//const MasterCardIcon = '../assets/CardImg/mastercard_icon.png';
//const CirrusIcon = '../assets/CardImg/cirrus_icon.png';
//const MaestroIcon = '../assets/CardImg/maestro_icon.png';
//const PaypalIcon = '../assets/CardImg/paypal_icon.png';
//const EbayIcon = '../assets/CardImg/ebay_icon.png';

class PaymentScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      firstName: '',
      lastName: '',
      cardNumber: '',
      cvv: '',
      paymentMethod: 'MasterCard', // Default payment method
      voucher: '',
      validUntilMonth: '01', // Default valid until month
      validUntilYear: '2023', // Default valid until year
      storedCartItems: [],
    };
  }

  handlePayment = () => {
    if (this.validateForm()) {
      const { voucher } = this.state;
      const subtotal = 30;
      const deliveryFee = 5.0;
      let voucherAmount = 0;
      if (voucher === '123456') {
        voucherAmount = 5.0; // Apply $5.00 discount if voucher is valid
      }
      const totalAmount = subtotal + deliveryFee - voucherAmount;

      this.props.navigation.navigate('SuccessOrder', { totalAmount });
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
    const subtotal = 30;
    const deliveryFee = 5.0;
    let voucherAmount = 0; // Initialize voucherAmount to 0
    if (this.state.voucher === '123456') {
      voucherAmount = 5.0; // Apply $5.00 discount if voucher is valid
    }
    const totalAmount = subtotal + deliveryFee - voucherAmount;

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
              {/* ... (Add other months) */}
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
              {/* ... (Add other years) */}
              <Picker.Item label="2030" value="2030" />
            </Picker>
          </View>
        </View>

        <Text style={styles.label}>Voucher Code</Text>
        <TextInput
          style={styles.input}
          placeholder="XXXXXX"
          onChangeText={(text) => this.setState({ voucher: text })}
        />

        <View style={styles.paymentContainer}>
          <Text style={styles.heading1}>Payment Details</Text>
          <Text>Subtotal: ${subtotal.toFixed(2)}</Text>
          <Text>Delivery Fee: ${deliveryFee.toFixed(2)}</Text>
          <Text>Voucher Amount: ${voucherAmount.toFixed(2)}</Text>
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
    marginTop: 20,
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
    marginTop: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: 'lightgray',
    borderRadius: 8,
    backgroundColor: 'white', // Background color of the payment details box
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
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
});

export default PaymentScreen;

   

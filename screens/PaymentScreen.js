import React, { Component } from 'react';
import { View, Text, TextInput, Button, StyleSheet,ScrollView  } from 'react-native';
import {Picker} from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
    const cvvRegex= /^[0-9]{4}$/; // 4-digit number

    return (
      firstName &&
      lastName &&
      cardNumberRegex.test(cardNumber) && // Validate card number
      cvvRegex
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

        <Text style={styles.label}>Payment Method</Text>
        
        <Picker
        selectedValue={this.state.paymentMethod}
        onValueChange={(itemValue) => this.setState({ paymentMethod: itemValue })}
      >
        <Picker.Item label="MasterCard" value="MasterCard" />
        <Picker.Item label="Visa" value="Visa" />
        <Picker.Item label="eBay" value="eBay" />
        <Picker.Item label="PayPal" value="PayPal" />
        <Picker.Item label="Maestro" value="Maestro" />
        <Picker.Item label="Cirrus" value="Cirrus" />
      </Picker>

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
            onValueChange={(itemValue) => this.setState({validUntilMonth:itemValue })}
            style={{ flex: 1 }}
          >
          <Picker.Item label="01 - January" value="01" />
          <Picker.Item label="02 - February" value="02" />
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
  },
  heading: {
    fontSize: 20,
    marginBottom: 10,
  },
  heading1: {
    fontSize: 18,
    marginBottom: 10,
    marginTop: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    padding: 5,
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
  },
  bottomSpace: {
    height: 40, // Adjust the height as needed
  },
});

export default PaymentScreen;
import React, { Component } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SQLite from 'react-native-sqlite-storage';
import {commonStyles} from "../style/CommonStyle"

const VisaIcon = require('../assets/CardImage/visa_icon.png');
const MasterCardIcon = require('../assets/CardImage/mastercard_icon.png');
const CirrusIcon = require('../assets/CardImage/cirrus_icon.png');
const MaestroIcon = require('../assets/CardImage/maestro_icon.png');
const PaypalIcon = require('../assets/CardImage/paypal_icon.png');
const EbayIcon = require('../assets/CardImage/ebay_icon.png');

class PaymentScreen extends Component {
  constructor(props) {
    super(props);
    this.db = SQLite.openDatabase(
      { name: 'coffeeDatabase' },
      this.openCallback,
      this.errorCallback
    );
    
    const { selectedAmount, fromAddBalanceScreen } = this.props.route.params;

    this.state = {
      firstName: '',
      lastName: '',
      cardNumber: '',
      cvv: '',
      paymentMethod: 'MasterCard',
      promocode: '',
      promoCodeCorrect: false,
      validUntilMonth: '01',
      validUntilYear: '2023',
      promocodeAmount: 0,
      unit_price: 0,
      selectedAmount: selectedAmount || 0, // Set selectedAmount from the parameter or 0 if not provided
      fromAddBalanceScreen: fromAddBalanceScreen || false, // Set fromAddBalanceScreen from the parameter or false if not provided
    };
  }

  // Function to handle fixed top-up button
  handleFixedTopUp = async () => {
    // You can perform any logic here for the fixed top-up
    const id = await AsyncStorage.getItem('id');
    const balance = await AsyncStorage.getItem('balance');
    const newBalance = (parseFloat(balance) + parseFloat(this.state.selectedAmount)).toString();
    try {
      const response = await fetch('http://192.168.50.78:5000/api/addBalance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          balance: newBalance,
          id : id, 
        }),
      });

      if (response.status === 200) {
        const data = await response.json();
        // Authentication successful, handle the user data
        await AsyncStorage.setItem('balance', newBalance);
        console.log(data);
        alert('Top Up Sucessfully');

      } else {
        const data = await response.json();
        // Authentication failed, show an error message
        console.error(data.message);
        alert('Top Up Failed');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Top Up Failed');
    }
    this.props.navigation.navigate('HomeStackHome');
  };

  handlePromoCodeChange = (text) => {
    this.setState({ promocode: text }, () => {
      if (this.state.promocode === '123456') {
        this.setState({ promoCodeCorrect: true });
      } else {
        this.setState({ promoCodeCorrect: false });
      }
    });
  };

  handlePayment = async (subtotal) => {
    const deliveryFee = 5.0;
    const id = await AsyncStorage.getItem('id');
    const balance = await AsyncStorage.getItem('balance');
    const numericBalance = parseFloat(balance);
  
    let promocodeAmount = 0;
  
    if (this.state.promocode === '123456') {
      promocodeAmount = 5.0;
      this.setState({ promoCodeCorrect: true });
    } else {
      this.setState({ promoCodeCorrect: false });
    }
  
    const totalAmount = subtotal + deliveryFee - promocodeAmount;
  
    if (this.state.paymentMethod === 'Balance' && numericBalance < totalAmount) {
      Alert.alert('Insufficient Balance', 'Your balance is not enough.');
    } else if (this.state.paymentMethod !== 'Balance' && !this.validateForm()) {
      Alert.alert('Invalid Input', 'Please fill out all fields correctly.');
    } else {
      const newBalance = this.state.paymentMethod === 'Balance' ? (numericBalance - totalAmount).toString() : numericBalance.toString();
      try {
        const response = await fetch('http://192.168.50.78:5000/api/addBalance', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            balance: newBalance,
            id : id, 
          }),
        });
  
        if (response.status === 200) {
          const data = await response.json();
          // Authentication successful, handle the user data
          await AsyncStorage.setItem('balance', newBalance);
          console.log(data);
          alert('Paid Sucessfully');
  
        } else {
          const data = await response.json();
          // Authentication failed, show an error message
          console.error(data.message);
          alert('Payment Failed, Server Connection Problem');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('Payment Failed, Server Connection Problem');
      }
      this.db.transaction((tx) => {
        tx.executeSql(
          'INSERT INTO orders (user_id, total_amount) VALUES (?, ?)',
          [id, totalAmount.toFixed(2)],
          (tx, result) => {
            const orderId = result.insertId;
            tx.executeSql(
              'SELECT * FROM cart WHERE user_id = ?',
              [id],
              (tx, resultSet) => {
                const rows = resultSet.rows;
                for (let i = 0; i < rows.length; i++) {
                  const item = rows.item(i);
  
                  tx.executeSql(
                    'INSERT INTO order_items (order_id, item_name, quantity, unit_price) VALUES (?, ?, ?, ?)',
                    [orderId, item.item_name, item.quantity, item.unit_price],
                    null,
                    (tx, error) => {
                      console.error('Error inserting order items:', error);
                      Alert.alert(
                        'Order Items Error',
                        'An error occurred while inserting order items.'
                      );
                    }
                  );
                }
                console.log('Navigating to SuccessOrderScreen');
                this.props.navigation.navigate('SuccessOrderScreen', {
                  formattedTotalAmount: totalAmount.toFixed(2),
                  paymentMethod: this.state.paymentMethod,
                });
              },
              (tx, error) => {
                console.error('Error fetching cart items:', error);
                Alert.alert(
                  'Payment Error',
                  'An error occurred while processing your payment.'
                );
              }
            );
          },
          (tx, error) => {
            console.error('Error inserting order:', error);
            Alert.alert(
              'Payment Error',
              'An error occurred while processing your payment.'
            );
          }
        );
      });
    }
  };  
  
  validateForm = () => {
    const { firstName, lastName, cardNumber, cvv } = this.state;
    const cardNumberRegex = /^[0-9]{16}$/;
    const cvvRegex = /^[0-9]{3,4}$/;

    return (
      firstName &&
      lastName &&
      cardNumberRegex.test(cardNumber) &&
      cvvRegex.test(cvv)
    );
  };

  render() {
    const subtotal = parseFloat(this.props.route.params.subtotal);
    const deliveryFee = 5.0;
    const promocodeAmount = this.state.promoCodeCorrect ? 5.0 : 0;
    const totalAmount = subtotal + deliveryFee - promocodeAmount;
  
    // Conditionally render the promo code section
  const promoCodeSection = this.state.fromAddBalanceScreen ? null : (
    <>
      <Text style={styles.label}>Promocode</Text>
      <View style={styles.promoCodeContainer}>
        <TextInput
          style={styles.input}
          placeholder="XXXXXX"
          onChangeText={(text) => this.handlePromoCodeChange(text)}
        />
        {this.state.promoCodeCorrect && (
          <Text style={styles.checkmarkIcon}>✔</Text>
        )}
      </View>
    </>
    );

    // Conditionally render the payment details section
    const paymentDetailsSection = this.state.fromAddBalanceScreen ? (
      <View style={styles.paymentContainer}>
        <Text style={styles.heading1}>Payment Details</Text>
        <Text>Total: ${this.state.selectedAmount.toFixed(2)}</Text>
      </View>
    ) : (
      <View style={styles.paymentContainer}>
        <Text style={styles.heading1}>Payment Details</Text>
        <Text>Subtotal: ${subtotal}</Text>
        <Text>Delivery Fee: ${deliveryFee.toFixed(2)}</Text>
        <Text>Discount: ${promocodeAmount.toFixed(2)}</Text>
        <Text>Total: ${totalAmount.toFixed(2)}</Text>
      </View>
    );

    const makePaymentSection = this.state.fromAddBalanceScreen ? (
      <TouchableOpacity
        onPress={() => {
          this.handleFixedTopUp(this.state.selectedAmount);
        }}
        style={[commonStyles.primaryButton, styles.bottomSpace]}
      >
        <Text style={[commonStyles.itemCode,{fontSize: 16}]} >Make Payment</Text>
      </TouchableOpacity>
    ) : (
      <TouchableOpacity
        onPress={() => {
          this.handlePayment(subtotal);
        }}
        style={[commonStyles.primaryButton, styles.bottomSpace]}
      >
        <Text style={[commonStyles.itemCode,{fontSize: 16}]} >Make Payment</Text>
      </TouchableOpacity>
    );    

    return (
      <ScrollView style={styles.container}>
        <Text style={styles.heading}>Order Confirmation</Text>
    
        <View style={styles.paymentMethodContainer}>
          <Text style={styles.label}>Payment Method</Text>
          <Picker
            selectedValue={this.state.paymentMethod}
            onValueChange={(itemValue) =>
              this.setState({ paymentMethod: itemValue })
            }
            style={styles.input}
          >
            <Picker.Item label="MasterCard" value="MasterCard" />
            <Picker.Item label="Visa" value="Visa" />
            <Picker.Item label="eBay" value="eBay" />
            <Picker.Item label="PayPal" value="PayPal" />
            <Picker.Item label="Maestro" value="Maestro" />
            <Picker.Item label="Cirrus" value="Cirrus" />
            {!this.state.fromAddBalanceScreen && ( <Picker.Item label="Using Balance" value="Balance" />)}
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
    
        {this.state.paymentMethod !== 'Balance' && (
          <View>
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
              maxLength={16}
              keyboardType="numeric"
            />
    
            <Text style={styles.label}>CVV</Text>
            <TextInput
              style={styles.input}
              onChangeText={(text) => this.setState({ cvv: text })}
              maxLength={4}
              keyboardType="numeric"
            />
    
            <Text style={styles.label}>Expiry Date</Text>
            <View style={styles.pickerContainer}>
              <View style={styles.pickerColumn}>
                <Picker
                  selectedValue={this.state.validUntilMonth}
                  onValueChange={(itemValue) =>
                    this.setState({ validUntilMonth: itemValue })
                  }
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
                  onValueChange={(itemValue) =>
                    this.setState({ validUntilYear: itemValue })
                  }
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
                  {/* Add more years */}
                </Picker>
              </View>
            </View>
          </View>
        )}
        
        {promoCodeSection}
        {paymentDetailsSection}
        {makePaymentSection}
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
    flex: 1,
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
    backgroundColor: 'white',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    marginBottom: 15,
  },
  bottomSpace: {
    marginBottom: 40,
  },
  paymentMethodContainer: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'lightgray',
    borderRadius: 8,
    padding: 10,
  },
  cardIconsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardIcon: {
    width: 40,
    height: 25,
    marginRight: 10,
  },
  promoCodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 200,
  },
  checkmarkIcon: {
    marginLeft: 10,
    marginBottom: 15,
    color: 'green',
    fontSize: 20,
  },
});

export default PaymentScreen;
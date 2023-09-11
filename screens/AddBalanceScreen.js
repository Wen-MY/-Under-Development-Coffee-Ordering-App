import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class AddBalanceScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      balanceToAdd: '', // The amount to be added to the balance
      isCustomAmount: false, // Flag to indicate if custom amount input should be shown
      isInputHighlighting: false, // Flag to indicate if input should be highlighted
    };

    // Create a ref for the initial amount TextInput
    this.initialAmountInputRef = React.createRef();
  }

  // Function to handle balance input
  handleBalanceChange = (value) => {
    this.setState({ balanceToAdd: value });
  };

// Function to handle quick top-up buttons
handleQuickTopUp = (amount) => {
  if (amount === 'Others') {
    this.setState({ isCustomAmount: true, balanceToAdd: '' }, () => {
      if (this.initialAmountInputRef.current) {
        // Set isInputHighlighting to true for 2 seconds
        this.setState({ isInputHighlighting: true });
        setTimeout(() => {
          this.setState({ isInputHighlighting: false });
        }, 2000);
        this.initialAmountInputRef.current.focus();
      }
    });
  } else {
    this.setState({ balanceToAdd: amount });
  }
};

  render() {
    return (
<View style={styles.container}>
    <Text style={styles.title}>Add Wallet Balance Screen</Text>
    <View style={styles.ReloadContainer1}>
    <Text style={styles.enterAmountText}>Enter your amount</Text>
      <View style={styles.inputContainer}>
          <Text style={styles.amountLabel}>RM</Text>
        <TextInput
          ref={this.initialAmountInputRef} // Attach the ref to the initial amount TextInput
          style={[
            styles.input,
            {
              borderColor: this.state.isInputHighlighting ? 'red' : 'white',
            },
          ]}
          placeholder="e.g. 10.00"
          placeholderTextColor="white"
          keyboardType="numeric"
          value={this.state.balanceToAdd}
          onChangeText={this.handleBalanceChange}
        />
      </View>
    </View>
    <View style={styles.ReloadContainer2}>
      <View style={styles.row}>
        {[
          { label: '10', value: "10" },
          { label: '20', value: "20" },
          { label: '50', value: "50" },
        ].map((item) => (
          <TouchableOpacity
            key={item.label}
            style={styles.quickTopUpButton}
            onPress={() => this.handleQuickTopUp(item.value)}>
            <Text style={styles.quickTopUpButtonText}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.row}>
        {[
          { label: '100', value: "100" },
          { label: '200', value: "200" },
          { label: 'Others', value: 'Others' },
        ].map((item) => (
          <TouchableOpacity
            key={item.label}
            style={styles.quickTopUpButton}
            onPress={() => this.handleQuickTopUp(item.value)}>
            <Text style={styles.quickTopUpButtonText}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
  </View>
  <TouchableOpacity
  onPress={() => {
    this.props.navigation.navigate('PaymentScreen', {
      selectedAmount: parseFloat(this.state.balanceToAdd),
      fromAddBalanceScreen: true,
    });
  }}
  style={styles.fixedTopUpButton}
>
  <Text style={styles.fixedTopUpButtonText}>+ Reload</Text>
</TouchableOpacity>

  </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:'#add8e6',

  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 50,
  },
  amountLabel: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    color:'white',
  },
  inputContainer: {
    flexDirection: 'row', 
    alignItems: 'center', 
  },
  ReloadContainer1: {
    paddingTop:30,
    paddingBottom:5, 
    padding: 20, 
    marginBottom: 30,
    borderRadius: 15,
    borderWidth: 2, 
    backgroundColor: '#0f4c81',
  },
    ReloadContainer2: {
    paddingTop:30,
    padding: 20, 
    marginBottom: 30,
    borderRadius: 15,
  },
  input: {
    borderWidth: 2,
    borderColor: 'white',
    padding: 10,
    width: 200,
    borderRadius: 5,
    marginTop: 10,
    marginBottom: 40,
    marginLeft: 15,
    color:'white',
    fontWeight:'bold',
    fontSize: 20,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  quickTopUpButton: {
    width: 80,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 30, 
    alignItems: 'center',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#0f4c81',
  },
  quickTopUpButtonText: {
    color: '#0f4c81',
    fontSize: 18,
    fontWeight:'bold',
  },
  fixedTopUpButton: {
    backgroundColor: '#0f4c81',
    padding: 10,
    borderRadius: 15,
    width: '50%',
    alignItems: 'center',
  },
  fixedTopUpButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight:'bold',
  },
    enterAmountText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10, 
    color:'white',
  },
});

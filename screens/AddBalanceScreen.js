import React, { Component, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';

export default class AddBalanceScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      balanceToAdd: '', // The amount to be added to the balance
    };
  }

  // Function to handle balance input
  handleBalanceChange = (value) => {
    this.setState({ balanceToAdd: value });
  };

  // Function to handle quick top-up buttons
  handleQuickTopUp = (amount) => {
    this.setState({ balanceToAdd: amount.toString() });
  };

  // Function to handle fixed top-up button
  handleFixedTopUp = () => {
    // You can perform any logic here for the fixed top-up
    // For now, let's just alert a message
    alert('Performing fixed top-up...');
  };

  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Add Wallet Balance Screen</Text>
        <TextInput
          style={{
            borderWidth: 1,
            borderColor: 'gray',
            padding: 10,
            width: 200,
            marginTop: 20,
          }}
          placeholder="Enter amount (e.g., 10.00)"
          keyboardType="numeric"
          value={this.state.balanceToAdd}
          onChangeText={this.handleBalanceChange}
        />
        <View style={{ marginTop: 20, flexDirection: 'row', justifyContent: 'space-between' }}>
          <TouchableOpacity onPress={() => this.handleQuickTopUp(10)}>
            <Text>10</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.handleQuickTopUp(20)}>
            <Text>20</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.handleQuickTopUp(50)}>
            <Text>50</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.handleQuickTopUp(100)}>
            <Text>100</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.handleQuickTopUp(200)}>
            <Text>200</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          onPress={this.handleFixedTopUp}
          style={{
            backgroundColor: 'blue',
            marginTop: 20,
            padding: 10,
            borderRadius: 5,
          }}>
          <Text style={{ color: 'white' }}>Perform Fixed Top-Up</Text>
        </TouchableOpacity>
      </View>
    );
  }
}


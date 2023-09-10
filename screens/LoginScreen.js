import React, { Component, useState } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            error: null,
        };
    }
    handleSignUpPress = () => {
        // Navigate to the Sign Up screen when the "Sign Up" button is pressed
        this.props.navigation.navigate('Sign Up');
    };
    handleLogin = async () => {
        try {
          const response = await fetch('http://192.168.0.125:5000/api/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              username: this.state.username, // Access the state variables
              password: this.state.password, // Access the state variables
            }),
          });
      
          if (response.status === 200) {
            const data = await response.json();
            // Authentication successful, handle the user data
            console.log(data.user);
            this.props.navigation.navigate('Home');
            const userId = data.user.id;
            await AsyncStorage.setItem('userId', userId.toString());
          } else {
            const data = await response.json();
            // Authentication failed, show an error message
            Alert.alert('Invalid username and password.');
          }
        } catch (error) {
          console.error('Error:', error);
        }
      };
    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>Welcome to our App</Text>
                <Text style={styles.subtitle}>Login or Sign Up to get started</Text>
                <View style={styles.inputContainer}>
                    <Icon name={'mobile-phone'} size={20} color="gray" style={styles.icon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Enter your username"
                        onChangeText={(username) => this.setState({ username })}
                        value={this.state.username}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <Icon name={'lock'} size={20} color="gray" style={styles.icon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Enter your password"
                        secureTextEntry={true}
                        onChangeText={(password) => this.setState({ password })}
                        value={this.state.password}
                    />
                </View>
                <Button title="Continue" onPress={this.handleLogin} />
                <Button title="Sign Up" onPress={this.handleSignUpPress} />
                {this.state.error && <Text style={styles.errorText}>{this.state.error}</Text>}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 20,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        marginBottom: 10,
        paddingLeft: 10,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginTop: 20, // Adjust the margin as needed
        marginBottom: 200,
    },
    subtitle: {
        fontSize: 16,
        color: '#888',
        marginBottom: 10,
    },
    icon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        height: 40,
        borderWidth: 0,
    },
});

import React, { Component } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import { TouchableOpacity, View, Text, TextInput, Button, StyleSheet, Image, NativeModules } from 'react-native';
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
    storeUserData = async (data) => {
        try {
          // Use multiSet to store data.user fields in AsyncStorage
          const userFields = Object.entries(data.user);
          const keyValuePairs = userFields.map(([key, value]) => [key, JSON.stringify(value)]);
      
          await AsyncStorage.multiSet(keyValuePairs);
        } catch (error) {
          console.error('Error storing user data:', error);
        }
    };
    getUserData = async () => {
        try {
          // Define the keys you want to retrieve
          const keysToRetrieve = ['balance', 'email', 'id', 'password', 'username'];
      
          // Use multiGet to retrieve values for the specified keys
          const keyValuePairs = await AsyncStorage.multiGet(keysToRetrieve);
      
          // Log the retrieved values
          keyValuePairs.forEach(([key, value]) => {
            console.log(`${key}: ${JSON.parse(value)}`);
          });
        } catch (error) {
          console.error('Error retrieving user data:', error);
        }
      };
    handleLogin = async () => {
        try {
          const response = await fetch('http://192.168.50.78:5000/api/login', {
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
            
            if(AsyncStorage.setItem('userToken','logged'))
              console.log("UserToken Set");
            this.storeUserData(data);
            //this.props.navigation.navigate('Home');
            NativeModules.DevSettings.reload();
          } else {
            const data = await response.json();
            // Authentication failed, show an error message
            console.error(data.message);
            
          }
        } catch (error) {
          console.error('Error:', error);
        }
      };

      render() {
        return (
            <>
                <View style={styles.container}>
                    <Text style={styles.title}>Welcome to our App</Text>
                      <View style={styles.logoPlaceholder}>
                    <Image source={require('../pictures/logo.png')} style={styles.logo} />
                    </View>
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
                    <TouchableOpacity style={styles.loginButton} onPress={this.handleLogin}>
                        <Text style={styles.loginButtonText}>Login</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.loginButton} onPress={this.handleSignUpPress}>
                        <Text style={styles.loginButtonText}>Sign Up</Text>
                    </TouchableOpacity>
                </View>
            </>
        );
    }
}

// Updated styles
const styles = StyleSheet.create({
  container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#b3e2e5', // Set your desired background color here
      padding: 20,
  },
  title: {
      fontSize: 28,
      color: '#19494d',
      fontFamily: 'Montserrat-Regular',
      marginBottom: 5,
  },
  subtitle: {
      fontSize: 16,
      fontFamily: 'Montserrat-Regular',
      color: '#888',
      marginBottom: 10,
  },
  logoContainer: {
      alignItems: 'center',
      marginBottom: 30, // Adjust the margin as needed
  },
  logo: {
      width: 200, // Set the desired width for your logo
      height: 200, // Set the desired height for your logo
      resizeMode: 'contain', // Adjust the image content mode as needed
      marginBottom: 10, // Add margin if necessary
  },
  inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 5,
      marginBottom: 15,
      paddingLeft: 10,
      backgroundColor: 'white', // Set input field background color
  },
  icon: {
      marginRight: 10,
  },
  input: {
      flex: 1,
      height: 40,
      borderWidth: 0,
  },
  loginButton: {
      backgroundColor: '#2d7f86',
      borderRadius: 5,
      paddingVertical: 10,
      paddingHorizontal: 30,
      marginTop: 15,
  },
  loginButtonText: {
      color: 'white',
      fontSize: 13,
      fontWeight: 'bold',
      textAlign: 'center',
  },
  errorText: {
      color: 'red',
      marginTop: 10,
  },
});
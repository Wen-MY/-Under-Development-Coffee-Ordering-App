import React, { Component } from 'react';
import CheckBox from '@react-native-community/checkbox';
import { Image, View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Linking, Alert } from 'react-native';

export default class SignUp extends Component {
    state = {
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        agreedToTerms: false,
    };

    handleTermsPress = () => {
        const termsUrl = 'https://www.youtube.com/watch?v=I2Yw9c_9Jt8&ab_channel=Saiful%27sUniverse';
        Linking.openURL(termsUrl);
    };

    toggleTermsAgreement = () => {
        this.setState((prevState) => ({
            agreedToTerms: !prevState.agreedToTerms,
        }));
    };

    validateEmail = (email) => {
        // Regular expression for email validation
        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
      
        if (!emailPattern.test(email)) {
          Alert.alert('Error', 'Please enter a valid email address.');
          return false;
        }
      
        return true;
      };

    handleSignUp = async () => {
        // Check if passwords match
        if (!this.state.username || !this.state.email || !this.state.password || !this.state.confirmPassword) {
            Alert.alert('Error', 'Please fill in all fields.');
            return;
        }
        
        if (this.state.username.length < 6 || this.state.username.length > 12) {
            Alert.alert('Error', 'Username must be between 6 and 12 characters.');
            return;
          }
          if (this.state.password.length < 8 || this.state.password.length > 16) {
            Alert.alert('Error', 'Password must be between 8 and 16 characters.');
            return;
          }

        if (this.state.password !== this.state.confirmPassword) {
            Alert.alert('Error', 'Passwords do not match.');
            return;
        }
    
        // Check if the terms agreement checkbox is checked
        if (!this.state.agreedToTerms) {
            Alert.alert('Error', 'You must agree to the terms and conditions.');
            return;
        }

        if (!this.validateEmail(this.state.email)) {
            return;
          }
    
        // Create a user object
        const newUser = {
            username: this.state.username,
            email: this.state.email,
            password: this.state.password,
        };
    
        try {
            // Send a POST request to the server for registration
            const response = await fetch('http://192.168.50.78:5000/api/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newUser),
            });
    
            // Handle the response, e.g., show a success message or an error message from the server
            if (response.status === 201) {
                Alert.alert('Success', 'Account created successfully.');
                // You can navigate to the login screen or take other actions here
                this.props.navigation.navigate('Login');
            } else {
                Alert.alert('Error', 'Registration failed. Please try again later.');
            }
        } catch (error) {
            console.error('Error:', error);
            Alert.alert('Error', 'Registration failed. Please try again later.');
        }
    };
    

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>Sign Up</Text>
                <View style={styles.logoContainer}>
                    <Image source={require('../pictures/logo.png')} style={styles.logo} />
                </View>
                <TextInput
                    style={styles.input}
                    placeholder="Username"
                    value={this.state.username}
                    onChangeText={(text) => this.setState({ username: text })}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Email Address"
                    value={this.state.email}
                    onChangeText={(text) => this.setState({ email: text })}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    secureTextEntry={true}
                    value={this.state.password}
                    onChangeText={(text) => this.setState({ password: text })}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Confirm Password"
                    secureTextEntry={true}
                    value={this.state.confirmPassword}
                    onChangeText={(text) => this.setState({ confirmPassword: text })}
                />
                 <View style={styles.termsContainer}>
                    <CheckBox
                        value={this.state.agreedToTerms}
                        onValueChange={this.toggleTermsAgreement}
                    />
                    <Text>I agree to the</Text>
                    <TouchableOpacity onPress={this.handleTermsPress}>
                        <Text style={styles.terms}>Terms and Conditions</Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.loginButton} onPress={this.handleSignUp}>
                    <Text style={styles.loginButtonText}>Sign Up</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#b3e2e5',
        padding: 20,
    },
    title: {
        fontSize: 28,
        color: '#19494d',
        fontFamily: 'Montserrat-Regular',
        marginBottom: 5,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 5,
    },
    logo: {
        width: 200,
        height: 200,
        resizeMode: 'contain',
        marginBottom: 10,
    },
    input: {
        width: '100%', // Set input width to 100%
        height: 40,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        marginBottom: 15,
        paddingLeft: 10,
        backgroundColor: 'white',
    },
    termsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    terms: {
        fontSize: 14,
        color: 'blue',
        marginLeft: 5,
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
});
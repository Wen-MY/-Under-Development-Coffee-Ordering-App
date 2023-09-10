import React, { Component } from 'react';
import CheckBox from '@react-native-community/checkbox';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Linking, Alert } from 'react-native';

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

    handleSignUp = async () => {
        // Check if passwords match
        if (!this.state.username || !this.state.email || !this.state.password || !this.state.confirmPassword) {
            Alert.alert('Error', 'Please fill in all fields.');
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
                <Text style={styles.title}>Sign Up Screen</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Username"
                    value={this.state.username}
                    onChangeText={(text) => this.setState({ username: text })}
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
                <TextInput
                    style={styles.input}
                    placeholder="Email Address"
                    value={this.state.email}
                    onChangeText={(text) => this.setState({ email: text })}
                />
                <View style={styles.termsContainer}>
                    <CheckBox
                        value={this.state.agreedToTerms}
                        onValueChange={this.toggleTermsAgreement}
                    />
                    <Text style={styles.terms}>I agree to the</Text>
                    <TouchableOpacity onPress={this.handleTermsPress}>
                        <Text style={styles.terms}>Terms and Conditions</Text>
                    </TouchableOpacity>
                </View>
                <Button title="Sign Up" onPress={this.handleSignUp} />
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
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    termsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20,
    },
    terms: {
        fontSize: 14,
        color: '#888',
        marginLeft: 5,
    },
    input: {
        width: '100%',
        height: 40,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        marginBottom: 10,
        paddingLeft: 10,
    },
});

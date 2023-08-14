import React, { Component } from 'react';
import CheckBox from '@react-native-community/checkbox';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Linking, Alert} from 'react-native';

export default class SignUp extends Component {
    state = {
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
        this.setState(prevState => ({
            agreedToTerms: !prevState.agreedToTerms,
        }));
    };

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>Sign Up Screen</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Email Address"
                    value={this.state.email}
                    onChangeText={text => this.setState({ email: text })}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Date of Birth"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    secureTextEntry={true}
                    value={this.state.password}
                    onChangeText={text => this.setState({ password: text })}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Confirm Password"
                    secureTextEntry={true}
                    value={this.state.confirmPassword}
                    onChangeText={text => this.setState({ confirmPassword: text })}
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
                <Button title="Sign Up" onPress={() => 
                    { 
                        Alert.alert('Registration Successful', 'You have successfully registered!');
                        this.props.navigation.navigate('Login')
                    }
                } />
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

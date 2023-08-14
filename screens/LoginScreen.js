import React, { Component } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

export default class Login extends Component {
    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>Welcome to our App</Text>
                <Text style={styles.subtitle}>Login or Sign Up to get started</Text>
                <View style={styles.inputContainer}>
                    <Icon name={'mobile-phone'} size={20} color="gray" style={styles.icon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Enter your phone number"
                        keyboardType="phone-pad"
                    />
                </View>
                <View style={styles.inputContainer}>
                    <Icon name={'lock'} size={20} color="gray" style={styles.icon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Enter your password"
                        secureTextEntry={true}
                    />
                </View>
                <Button title="Continue" onPress={() => this.props.navigation.navigate('SignUp')} />
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

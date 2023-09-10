import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';

const ChangeUsernameScreen = () => {
  const [newUsername, setNewUsername] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleUsernameChange = () => {
    // Here you can add your logic to update the username
    if (newUsername.trim() === '') {
      setErrorMessage('Username cannot be empty');
    } else {
      // Perform the username change action
      setErrorMessage('');
      Alert.alert('Username changed to:', newUsername);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Set New Username</Text>

      <TextInput
        style={styles.input}
        placeholder="New Username"
        onChangeText={text => setNewUsername(text)}
        value={newUsername}
      />

      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

      <TouchableOpacity style={styles.button} onPress={handleUsernameChange}>
        <Text style={styles.buttonText}>Change Username</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    paddingTop: 20,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    color: '#1f1f1f',
    fontWeight: 'bold',
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
  },
});

export default ChangeUsernameScreen;
import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Share } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileScreen = () => {
  
  const [user, setUser] = useState({
    username: '',
    email: '',
    phoneNumber: '123-456-7890',
    additionalInfo: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    profileImage: require('../assets/otherImg/user.png'), // Provide the actual image path
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const username = await AsyncStorage.getItem('username');
        const cleanedUsername = username ? username.replace(/"/g, '') : '';
        const email = await AsyncStorage.getItem('email');
        const cleanedEmail = email ? email.replace(/"/g, '') : '';
        setUser((prevUser) => ({
          ...prevUser,
          username : cleanedUsername,
          email : cleanedEmail, 
        }));
      } catch (error) {
        console.error('Error fetching user data:', error.message);
      }
    }

    fetchData();
  }, []);

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out ${user.name}'s profile:\nEmail: ${user.email}\nPhone: ${user.phoneNumber}`,
      });
    } catch (error) {
      console.error('Error sharing profile:', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={user.profileImage} style={styles.profileImage} />

      <Text style={styles.name}>{user.name}</Text>

      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>Email: {user.email}</Text>
        <Text style={styles.infoText}>Phone Number: {user.phoneNumber}</Text>
      </View>

      <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
        <Text style={styles.shareButtonText}>Share Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f8f8',
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  infoContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: '80%',
  },
  infoText: {
    fontSize: 16,
    marginBottom: 10,
  },
  additionalInfo: {
    fontSize: 14,
    marginTop: 10,
  },
  shareButton: {
    marginTop: 20,
    backgroundColor: '#a9a9a9',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    width: '80%',
  },
  shareButtonText: {
    fontSize: 18,
    color: '#fff',
  },
});

export default ProfileScreen;

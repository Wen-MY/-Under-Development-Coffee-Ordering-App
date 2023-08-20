import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Share } from 'react-native';

const ProfileScreen = () => {
  const user = {
    name: 'John Doe',
    email: 'johndoe@example.com',
    phoneNumber: '123-456-7890',
    birthDate: '1990-01-01',
    additionalInfo: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    profileImage: require('../assets/otherImg/user.png'), // Provide the actual image path
  };

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
        <Text style={styles.infoText}>Phone: {user.phoneNumber}</Text>
        <Text style={styles.infoText}>Birth Date: {user.birthDate}</Text>
        <Text style={styles.additionalInfo}>{user.additionalInfo}</Text>
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
    backgroundColor: '#FFF',
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

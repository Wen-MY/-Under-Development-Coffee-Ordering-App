import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Switch, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const SettingScreen = () => {
  const [pushNotification, setPushNotification] = useState(false);

  const navigation = useNavigation();

  const togglePushNotification = () => {
    setPushNotification(!pushNotification);
  };

  return (
    <View style={styles.container}>

      {/* Notifications */}
      <Text style={styles.sectionHeader}>Notification</Text>
      <View style={styles.optionRow}>
        <Text style={styles.optionLabel}>Push Notifications:</Text>
        <Switch
          value={pushNotification}
          onValueChange={togglePushNotification}
        />
      </View>

      {/* Account */}
      <Text style={styles.sectionHeader}>Account</Text>
      <TouchableOpacity style={styles.optionRow} onPress={() => navigation.navigate('Change Username')}>
        <Text style={styles.optionLabel}>Change Username</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.optionRow} onPress={() => navigation.navigate('Change Password')}>
        <Text style={styles.optionLabel}>Change Password</Text>
      </TouchableOpacity>

      {/* Help */}
      <Text style={styles.sectionHeader}>Help</Text>
      <TouchableOpacity style={styles.optionRow} onPress={() => navigation.navigate('Terms and Conditions')}>
        <Text style={styles.optionLabel}>Term and Conditions</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.optionRow} onPress={() => {}}>
        <Text style={styles.optionLabel}>About Us</Text>
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
  sectionHeader: {
    fontSize: 14,
    color: '#adadad',
    textTransform: 'uppercase',
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  optionLabel: {
    fontSize: 18,
    color: '#000',
  },
});

export default SettingScreen;

import {Text, StyleSheet} from 'react-native';
import React, {Component} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'

import HomeScreen from './screens/HomeScreen';
import ProfileScreen from './screens/ProfileScreen';
import CartScreen from './screens/CartScreen';
import MenuScreen from './screens/MenuScreen';
import SettingScreen from './screens/SettingScreen';
import CoffeeDetailScreen from './screens/CoffeeDetailScreen';
const Tab = createBottomTabNavigator ();
export default class App extends Component{
  render(){
    return(
      <NavigationContainer>
        <Tab.Navigator 
          initialRouteName='Home'
          screenOptions={{
            tabBarActiveTintColor: 'white',
            tabBarActiveBackgroundColor: '#0f4c81',
            tabBarLabelStyle: {
              fontSize: 22,
            },
            tabBarStyle:{
              backgroundColor: 'lightgrey',
              borderRadius: 50.
            },
          }}

        >
          <Tab.Screen
            name = 'Home'
            component = {HomeScreen}
            options={{/*
              tabBarIcon: () => {
                return <FontAwesomeIcon icon="fa-sharp fa-regular fa-house-blank" size={20}/>
              }*/
              }
            }
            />
          <Tab.Screen
            name = 'Menu'
            component = {MenuScreen}
            options={{/*
              tabBarIcon: () => {
                return <FontAwesomeIcon icon="fa-regular fa-mug-hot" size={20}/>
              }*/
              headerShown:false
              }
            }
            />
             <Tab.Screen
            name = 'Cart'
            component = {CartScreen}
            options={{/*
              tabBarIcon: () => {
                return <FontAwesomeIcon icon="fa-regular fa-cart-shopping" size={20}/>
              }*/
              }
            }
            />
            <Tab.Screen
            name = 'Profile'
            component = {ProfileScreen}
            options={{/*
              tabBarIcon: () => {
                return <FontAwesomeIcon icon="fa-regular fa-user" size={20}/>
              }*/
              }
            }
            />
        </Tab.Navigator>
      </NavigationContainer>
    );
  }
}

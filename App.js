import React from 'react';
import { View, Text, ImageBackground, StyleSheet, Image, ScrollView } from 'react-native';
import 'react-native-gesture-handler';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { Avatar } from 'react-native-paper';
import HomeScreen from './screens/HomeScreen';
import MenuScreen from './screens/MenuScreen';
import CartScreen from './screens/CartScreen';
import TermAndConditionsScreen from './screens/TermsAndConditions';
import CoffeeDetailScreen from './screens/CoffeeDetailScreen';
import ProfileScreen from './screens/ProfileScreen';
import SettingScreen from './screens/SettingScreen';
import LoginScreen from './screens/LoginScreen';
import ChangePassword from './screens/ChangePasswordScreen';
import ChangeUsername from './screens/ChangeUsernameScreen';
import OrderHistoryScreen from './screens/OrderHistoryScreen';
import PaymentScreen from './screens/PaymentScreen'; // Import your PaymentScreen component
import DatabaseInitialization from './components/DatabaseInitialization'; 

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();
const SettingSubStack = createStackNavigator();

const SettingSubNavigator = () => (
  <SettingSubStack.Navigator>
    <SettingSubStack.Screen name="Settings" component={SettingScreen} />
    <SettingSubStack.Screen name="Change Username" component={ChangeUsername} />
    <SettingSubStack.Screen name="Change Password" component={ChangePassword} />
  </SettingSubStack.Navigator>
);

const CustomDrawerContent = (props) => {
  return (
    <DrawerContentScrollView {...props}>
      <ImageBackground 
        source={require('./assets/otherImg/background.jpg')}
        style={{width: undefined, padding: 16, paddingTop: 48}}
      >
        <Avatar.Image
          source={require('./assets/otherImg/user.png')} // Replace with your image source
          size={70}
          style={styles.profileImage}
        />
        <Text style={styles.userName}>User's Name</Text>
        </ImageBackground>
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
};

const SettingStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="Change Username" component={ChangeUsername} />
    <Stack.Screen name="Change Password" component={ChangePassword} />
  </Stack.Navigator>
);
const MenuStack = () => (
  <Stack.Navigator initialRouteName='Menu'>
    <Stack.Screen name="Menu" component={MenuScreen} />
    <Stack.Screen name="Coffee" component={CoffeeDetailScreen} />
  </Stack.Navigator>
);

function AppBottomStack() {
  return (
    <Tab.Navigator 
      initialRouteName='Home'
      screenOptions={{
        tabBarActiveTintColor: 'white',
        tabBarActiveBackgroundColor: '#0f4c81',
        tabBarLabelStyle: {
          fontSize: 22,
        },
        tabBarStyle: {
          backgroundColor: 'lightgrey',
          borderRadius: 50,
        },
      }}
    >
      {/* Your Tab Screens */}
      <Tab.Screen
      name = 'Home'
      component = {HomeScreen}
      options={{/*
        tabBarIcon: () => {
          return <FontAwesomeIcon icon="fa-sharp fa-regular fa-house-blank" size={20}/>
        }*/
        headerShown:false
        }
      }
      />
    <Tab.Screen
      name = 'Menu'
      component = {MenuStack}
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
      name = 'Order'
      component = {OrderHistoryScreen}
      options={{/*
        tabBarIcon: () => {
          return <FontAwesomeIcon icon="fa-regular fa-user" size={20}/>
        }*/
        }
      }
      />
  </Tab.Navigator>
  );
}

function AppDrawerStack() {
  return (
    <Drawer.Navigator
      drawerStyle={{ width: '45%', backgroundColor: 'purple' }}
      drawerType="slide"
      overlayColor="transparent"
      screenOptions={{
        drawerActiveTintColor: 'darkslateblue',
        drawerActiveBackgroundColor: 'skyblue',
      }}
      drawerContent={CustomDrawerContent}
    >
      {/* Your Drawer Screens */}
      <Drawer.Screen name ='Home' component={AppBottomStack} options={{ headerShown: false }} />
      <Drawer.Screen name="Profile" component={ProfileScreen} />
      <Drawer.Screen name="Settings" component={SettingSubNavigator} />
      <Drawer.Screen name="Sign Out" component={LoginScreen}/>
    </Drawer.Navigator>
  );
}

export default function App() {
  const dbInit = new DatabaseInitialization();
  dbInit._initializeDatabase();
  return (
    
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="AppDrawerStack" component={AppDrawerStack} options={{ headerShown: false }} />
        <Stack.Screen name="PaymentScreen" component={PaymentScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
const styles = StyleSheet.create({
  drawerHeader: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'purple',
  },
  profileImage: {
    marginRight: 15,
    borderColor: "#FFF"
  },
  userName: {
    fontSize: 18,
    color: 'white',
  },
});
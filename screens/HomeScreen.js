import React, { Component } from "react";
import { Text, View, StyleSheet, Dimensions, Button,Image } from "react-native";
import Carousel from "react-native-reanimated-carousel";
import {commonStyles} from "../style/CommonStyle"
import { TouchableOpacity } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";
import WeatherForecast from "../components/WeatherForecast";


const imagePaths = [
  require('../assets/otherImg/CarouselAd/0.png'),
  require('../assets/otherImg/CarouselAd/1.png'),
  require('../assets/otherImg/CarouselAd/2.png'),
  require('../assets/otherImg/CarouselAd/3.png'),
  require('../assets/otherImg/CarouselAd/4.png'),
  require('../assets/otherImg/CarouselAd/5.png'),
];

export default class HomeScreen extends Component{
    constructor(props){
        super(props);
        this.state = {
            width : Dimensions.get('screen').width,
            username : "Guest User",
            balance : "0.00"
        };
    }
    
    handleOrderNowPress = () => {
      this.props.navigation.navigate('Menu'); // Navigate to the 'Menu' tab
  };
  handleAddBalancePress = () =>{
    this.props.navigation.navigate('AddBalance');
  };
  componentDidMount() {
    AsyncStorage.getItem('username')
      .then((username) => {
        if(username !== null)
        {
          const cleanedUsername = username ? username.replace(/"/g, '') : '';
          this.setState({  username: cleanedUsername });
        } // Update the state with the retrieved username
      })
      .catch((error) => {
        console.error('Error retrieving username:', error);
      });
    AsyncStorage.getItem('balance')
      .then((balance) => {
        this.setState({ balance }); // Update the state with the retrieved username
      })
      .catch((error) => {
        console.error('Error retrieving username:', error);
      });
  }
  componentDidUpdate(){
    AsyncStorage.getItem('balance')
      .then((balance) => {
        this.setState({ balance }); // Update the state with the retrieved username
      })
      .catch((error) => {
        console.error('Error retrieving username:', error);
      });
  }
    render(){
        return(
            <View style={styles.container}>
                {/* Carousel Slide Advertisement box here */}
                <Carousel
                    loop
                    width = {this.state.width}
                    height = {this.state.width/2}
                    autoPlay = {true}
                    data={[...new Array(6).keys()]} // will change to photo if assets added
                    //data = {[...new Array(6).keys()].map(index => `../assets/otherImg/CarouselAd/${index}.png`)}
                    scrollAnimationDuration={1200}
                    mode="parallax"
                    pagingEnabled={true}
                    //onSnapToItem={(index) => console.log('current index:', index)} //debug purpose
                    renderItem={({ index }) => (
                        <View
                            style={{
                                flex: 1,
                                //borderWidth: 0,
                                justifyContent: 'center',
                                //backgroundColor : 'black',
                            }}>
                                 <Image 
                                 source={imagePaths[index]} 
                                 style={{ width: '100%', height: '100%' }} />
                          
                        </View>
                    )}// will change to image if exist
                    />
                    {/* Balance Box here */}
                    <View style={styles.boxContainer}>
                    <View style={{ flexDirection: 'row',alignItems: 'center', justifyContent: 'space-between'}}>
                        <View>
                          <Text style={styles.primaryTextBold}>Welcome, {this.state.username}</Text>
                          <TouchableOpacity onPress={this.handleAddBalancePress}>
                          <Text style={{marginTop: 10}}>Balance</Text>  
                          <Text style={styles.primaryTextBold}>RM<Text style={{ fontSize: 24 }}>{parseFloat(this.state.balance).toFixed(2)}
                          </Text></Text> 
                          </TouchableOpacity>
                        </View>
                        <WeatherForecast style={{marginLeft: 10}}/>
                      </View>
                    </View>
                    {/* Order Now Box here */}
                    <View style={styles.boxContainer}>
                      <Text style={{textAlign:'center'}}>Our Nearest Store At</Text>
                      <Text style={[styles.primaryTextBold,{textAlign:'center'}]}>NEStar Coffee -Bandar Sungai Long</Text>
                      <View style={{marginTop: 30, marginHorizontal:70}}>
                      <TouchableOpacity onPress={this.handleOrderNowPress} style={commonStyles.primaryButton}>
                      <Text style={[commonStyles.itemCode,{fontSize: 16}]} >Order Now</Text>
                      </TouchableOpacity>
                      </View>
                    </View>
            </View>

        )
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    text: {
      fontSize: 25,
      fontWeight: '500',
      textAlign : 'center',
    },
    boxContainer: {
        backgroundColor: '#ffffff', // Background color of the box , white
        borderRadius: 10, // Rounded corners
        margin: 10,
        padding: 20, // Padding inside the box
        shadowColor: '#000000', // Shadow color
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.2, // Shadow opacity
        shadowRadius: 4, // Shadow radius
        elevation: 5, // Android shadow elevation
      },
      primaryText: {
        fontSize: 18,
        color: '#333', // Primary text color
      },
      primaryTextBold: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#0f4c81', // Primary text color
      },
      secondaryText: {
        fontSize: 16,
        color: '#666', // Secondary text color
      },
})
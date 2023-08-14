import React, {Component} from "react";
import {Text,View,StyleSheet,Dimensions} from "react-native";
import Carousel from "react-native-reanimated-carousel";


export default class HomeScreen extends Component{
    constructor(props){
        super(props);
        this.state = {
            width : Dimensions.get('screen').width
        };
    }
    render(){
        return(
            <View style={styles.container}>
                <Carousel
                    loop
                    width = {this.state.width}
                    height = {this.state.width/2}
                    autoPlay = {true}
                    data={[...new Array(6).keys()]} // will change to photo if assets added
                    scrollAnimationDuration={1000}
                    mode="parallax"
                    pagingEnabled={true}
                    //onSnapToItem={(index) => console.log('current index:', index)} //debug purpose
                    renderItem={({ index }) => (
                        <View
                            style={{
                                flex: 1,
                                borderWidth: 1,
                                justifyContent: 'center',
                                //backgroundColor : 'black',
                            }}
                        >
                           <Text style={{ textAlign: 'center', fontSize: 30 }}>
                                {index}
                            </Text>
                            
                        </View>
                    )}// will change to image if exist
                    />
                    <View style={styles.boxContainer}>
                        <Text style={styles.primaryTextBold}>Welcome , "username "</Text>
                        
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
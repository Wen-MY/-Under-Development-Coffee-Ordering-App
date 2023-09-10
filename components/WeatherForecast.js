import React, { useState, useEffect } from 'react';
import { View, Text,Image } from 'react-native';
const clearDay = require('../assets/WeatherImage/Day/clear.png');
const cloudyDay = require('../assets/WeatherImage/Day/cloud.png');
const rainDay = require('../assets/WeatherImage/Day/rain.png');
const snowDay = require('../assets/WeatherImage/Day/snow.png');
const clearNight = require('../assets/WeatherImage/Night/clear.png');
const cloudyNight = require('../assets/WeatherImage/Night/cloud.png');
const rainNight = require('../assets/WeatherImage/Night/rain.png');
const snowNight = require('../assets/WeatherImage/Night/snow.png');


const WeatherForecast = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [currentTimepoint, setCurrentTimepoint] = useState(null);

  useEffect(() => {
    // Define the API endpoint URL for JSON data
    const apiUrl = 'http://www.7timer.info/bin/api.pl?lon=95.459102&lat=19.947533&product=civil&output=json';

    // Fetch raw weather data from the API
    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        setWeatherData(data);
        //console.log(data);
      })
      .catch((error) => {
        console.error('Error fetching weather data:', error);
      });
  }, []);

  const matchWeatherToConditions = (weatherDescription, isNight) => {
    if (isNight) {
      if (weatherDescription.includes('clear')) {
        return clearNight;
      } else if (weatherDescription.includes('cloudy')) {
        return cloudyNight;
      } else if (weatherDescription.includes('rain')) {
        return rainNight;
      } else if (weatherDescription.includes('snow')) {
        return snowNight;
      } else {
        return clearNight;
      }
    } else {
      if (weatherDescription.includes('clear')) {
        return clearDay;
      } else if (weatherDescription.includes('cloudy')) {
        return cloudyDay;
      } else if (weatherDescription.includes('rain')) {
        return rainDay;
      } else if (weatherDescription.includes('snow')) {
        return snowDay;
      } else {
        return clearDay;
      }
    }
  };
  // Function to display the weather for the closest timepoint
  const displayWeather = () => {
    // Calculate whether it's currently morning or night based on the current hour (0-23)
    const currentHourUTC = new Date().getUTCHours() + 8;
    const isNight = currentHourUTC >= 19 || currentHourUTC < 7; // Assuming night is from 7 PM to 7 AM
    const currentTimepoint = weatherData.dataseries[0];
    const weatherDescription = currentTimepoint.weather.toLowerCase();
    if (currentTimepoint) {
      return (
        <Image source={matchWeatherToConditions(weatherDescription, isNight)}>
        </Image>
      );
    }
    return <Text>Loading weather data...</Text>;
  };
  return (
    <View>
      {weatherData ? (
        <View>
          {displayWeather()}
        </View>
      ) : (
        <Text>Loading weather data...</Text>
      )}
    </View>
  );
};

export default WeatherForecast;

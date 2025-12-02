import { useState, useEffect } from 'react';
import { WeatherData } from '../types';

// Extended Mock Data
const MOCK_WEATHER: Record<string, WeatherData> = {
  'France': {
    location: 'Paris, France',
    temp: 18,
    condition: 'Clear',
    humidity: 45,
    windSpeed: 12,
    description: 'Sunny skies'
  },
  'Japan': {
    location: 'Tokyo, Japan',
    temp: 22,
    condition: 'Rain',
    humidity: 80,
    windSpeed: 5,
    description: 'Light showers'
  },
  'USA': {
    location: 'New York, USA',
    temp: 15,
    condition: 'PartlyCloudy',
    humidity: 60,
    windSpeed: 15,
    description: 'Partly cloudy'
  },
  'UK': {
    location: 'London, UK',
    temp: 12,
    condition: 'Drizzle',
    humidity: 85,
    windSpeed: 10,
    description: 'Light rain'
  },
  'Brazil': {
    location: 'Rio de Janeiro, Brazil',
    temp: 28,
    condition: 'Thunderstorm',
    humidity: 70,
    windSpeed: 8,
    description: 'Thunderstorms'
  },
  'Australia': {
    location: 'Sydney, Australia',
    temp: 24,
    condition: 'Windy',
    humidity: 55,
    windSpeed: 20,
    description: 'Breezy'
  },
  'Canada': {
    location: 'Toronto, Canada',
    temp: -8,
    condition: 'Snow',
    humidity: 40,
    windSpeed: 12,
    description: 'Heavy snow'
  },
  'India': {
    location: 'Mumbai, India',
    temp: 32,
    condition: 'Haze',
    humidity: 90,
    windSpeed: 4,
    description: 'Hazy'
  },
  'Egypt': {
    location: 'Cairo, Egypt',
    temp: 35,
    condition: 'Dust',
    humidity: 20,
    windSpeed: 10,
    description: 'Dusty'
  },
  'Russia': {
    location: 'Moscow, Russia',
    temp: 5,
    condition: 'Overcast',
    humidity: 50,
    windSpeed: 15,
    description: 'Overcast'
  },
  'Iceland': {
    location: 'Reykjavik, Iceland',
    temp: 2,
    condition: 'Fog',
    humidity: 95,
    windSpeed: 25,
    description: 'Foggy'
  },
  'Norway': {
    location: 'Oslo, Norway',
    temp: -5,
    condition: 'Sleet',
    humidity: 75,
    windSpeed: 18,
    description: 'Icy sleet'
  },
  'Spain': {
    location: 'Madrid, Spain',
    temp: 26,
    condition: 'PartlyCloudy',
    humidity: 35,
    windSpeed: 8,
    description: 'Partly cloudy'
  },
  'Germany': {
    location: 'Berlin, Germany',
    temp: 14,
    condition: 'Drizzle',
    humidity: 70,
    windSpeed: 10,
    description: 'Light drizzle'
  },
  'Mexico': {
    location: 'Mexico City, Mexico',
    temp: 21,
    condition: 'Haze',
    humidity: 55,
    windSpeed: 6,
    description: 'Hazy conditions'
  },
  'Argentina': {
    location: 'Buenos Aires, Argentina',
    temp: 19,
    condition: 'Wind',
    humidity: 60,
    windSpeed: 30,
    description: 'Very windy'
  },
  'China': {
    location: 'Beijing, China',
    temp: 10,
    condition: 'Dust',
    humidity: 30,
    windSpeed: 14,
    description: 'Dusty'
  },
  'Italy': {
    location: 'Rome, Italy',
    temp: 23,
    condition: 'Clear',
    humidity: 48,
    windSpeed: 7,
    description: 'Beautiful weather'
  }
};

export function useWeather() {
  const [weatherData, setWeatherData] = useState<Record<string, WeatherData>>(MOCK_WEATHER);

  useEffect(() => {
    const interval = setInterval(() => {
      setWeatherData(prev => {
        const newData: Record<string, WeatherData> = {};
        Object.keys(prev).forEach(key => {
          newData[key] = {
            ...prev[key],
            temp: Math.round((prev[key].temp + (Math.random() > 0.5 ? 0.2 : -0.2)) * 10) / 10
          };
        });
        return newData;
      });
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return { weatherData };
}

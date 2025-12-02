export type WeatherCondition = 'Clear' | 'Clouds' | 'Rain' | 'Snow' | 'Thunderstorm' | 'Drizzle' | 'Mist' | 'PartlyCloudy' | 'Windy' | 'Haze' | 'Dust' | 'Overcast' | 'Fog' | 'Sleet' | 'Wind';

export interface WeatherData {
  location: string;
  temp: number;
  condition: WeatherCondition;
  humidity: number;
  windSpeed: number;
  description: string;
}

export interface Pet {
  id: string;
  name: string;
  country: string;
  weather: WeatherData;
  mood: 'Happy' | 'Gloomy' | 'Excited' | 'Sleepy' | 'Angry';
  position: { x: number; y: number };
}


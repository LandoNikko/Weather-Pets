import { useMemo } from 'react';

const METEOCONS_CDN = 'https://cdn.jsdelivr.net/gh/basmilius/weather-icons@dev/production/fill/svg';

const weatherConditionToIcon: Record<string, { day: string; night: string }> = {
  'Clear': { day: 'clear-day', night: 'clear-night' },
  'Clouds': { day: 'cloudy', night: 'cloudy' },
  'Rain': { day: 'rain', night: 'rain' },
  'Drizzle': { day: 'drizzle', night: 'drizzle' },
  'Thunderstorm': { day: 'thunderstorms-day', night: 'thunderstorms-night' },
  'Thunderstorms': { day: 'thunderstorms-day', night: 'thunderstorms-night' },
  'Snow': { day: 'snow', night: 'snow' },
  'Mist': { day: 'mist', night: 'mist' },
  'Fog': { day: 'fog-day', night: 'fog-night' },
  'Haze': { day: 'haze-day', night: 'haze-night' },
  'Smoke': { day: 'smoke', night: 'smoke' },
  'Dust': { day: 'dust-day', night: 'dust-night' },
  'Sand': { day: 'dust-day', night: 'dust-night' },
  'Ash': { day: 'smoke', night: 'smoke' },
  'Squall': { day: 'wind', night: 'wind' },
  'Tornado': { day: 'tornado', night: 'tornado' },
  'Overcast': { day: 'overcast-day', night: 'overcast-night' },
  'PartlyCloudy': { day: 'partly-cloudy-day', night: 'partly-cloudy-night' },
  'Sleet': { day: 'sleet', night: 'sleet' },
  'Hail': { day: 'hail', night: 'hail' },
  'Extreme': { day: 'extreme-day', night: 'extreme-night' },
  'ExtremeRain': { day: 'extreme-rain', night: 'extreme-rain' },
  'ExtremeSnow': { day: 'extreme-snow', night: 'extreme-snow' },
  'ExtremeDrizzle': { day: 'extreme-day-drizzle', night: 'extreme-night-drizzle' },
  'ExtremeFog': { day: 'extreme-fog', night: 'extreme-fog' },
  'ExtremeHail': { day: 'extreme-hail', night: 'extreme-hail' },
  'ExtremeSleet': { day: 'extreme-sleet', night: 'extreme-sleet' },
  'ExtremeHaze': { day: 'extreme-day-haze', night: 'extreme-night-haze' },
  'Wind': { day: 'wind', night: 'wind' },
  'Windy': { day: 'wind', night: 'wind' },
  'Hurricane': { day: 'hurricane', night: 'hurricane' },
  'Raindrop': { day: 'raindrop', night: 'raindrop' },
  'Raindrops': { day: 'raindrops', night: 'raindrops' },
  'Snowflake': { day: 'snowflake', night: 'snowflake' },
  'PartlyCloudyDayRain': { day: 'partly-cloudy-day-rain', night: 'partly-cloudy-night-rain' },
  'PartlyCloudyDaySnow': { day: 'partly-cloudy-day-snow', night: 'partly-cloudy-night-snow' },
  'PartlyCloudyDayDrizzle': { day: 'partly-cloudy-day-drizzle', night: 'partly-cloudy-night-drizzle' },
  'PartlyCloudyDayHail': { day: 'partly-cloudy-day-hail', night: 'partly-cloudy-night-hail' },
  'PartlyCloudyDaySleet': { day: 'partly-cloudy-day-sleet', night: 'partly-cloudy-night-sleet' },
  'PartlyCloudyDayFog': { day: 'partly-cloudy-day-fog', night: 'partly-cloudy-night-fog' },
  'PartlyCloudyDayHaze': { day: 'partly-cloudy-day-haze', night: 'partly-cloudy-night-haze' },
  'PartlyCloudyDaySmoke': { day: 'partly-cloudy-day-smoke', night: 'partly-cloudy-night-smoke' },
  'CloudUp': { day: 'cloud-up', night: 'cloud-up' },
  'CloudDown': { day: 'cloud-down', night: 'cloud-down' },
  'Dust-Day': { day: 'dust-day', night: 'dust-night' },
  'Dust-Wind': { day: 'dust-wind', night: 'dust-wind' }
};

const isNightTime = (): boolean => {
  const hour = new Date().getHours();
  return hour < 6 || hour >= 20;
};

interface WeatherIconProps {
  condition: string;
  size?: number;
  className?: string;
}

export const WeatherIcon: React.FC<WeatherIconProps> = ({ 
  condition, 
  size = 48, 
  className = '' 
}) => {
  const iconUrl = useMemo(() => {
    const isNight = isNightTime();
    const iconMapping = weatherConditionToIcon[condition] || weatherConditionToIcon['Clouds'];
    const iconName = isNight ? iconMapping.night : iconMapping.day;
    return `${METEOCONS_CDN}/${iconName}.svg`;
  }, [condition]);

  return (
    <img
      src={iconUrl}
      alt={condition}
      className={`inline-block ${className}`}
      width={size}
      height={size}
      onError={(e) => {
        e.currentTarget.src = `${METEOCONS_CDN}/cloudy.svg`;
      }}
    />
  );
};

export const getWeatherIcon = (condition: string, size: number = 48) => {
  return <WeatherIcon condition={condition} size={size} />;
};

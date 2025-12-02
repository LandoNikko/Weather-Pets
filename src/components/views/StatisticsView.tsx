import React, { useState, useMemo } from 'react';
import { Pet, WeatherData } from '../../types';
import { MapPin, TrendingUp, TrendingDown, Thermometer, Wind, Droplets, Calendar, Clock, History } from 'lucide-react';
import { StickerContainer } from '../StickerContainer';
import { Sticker } from '../Sticker';
import { getWeatherIcon } from '../../utils/weatherIcons';
import { SettingsContextType } from '../../context/SettingsContext';

interface StatisticsViewProps {
  pets: Pet[];
  settings: SettingsContextType;
}

interface HistoricalDataPoint {
  date: Date;
  temp: number;
  humidity: number;
  windSpeed: number;
  condition: string;
}

interface ForecastDataPoint {
  time: string;
  temp: number;
  condition: string;
  humidity: number;
}

const petsStickers = [
  { position: { x: 'calc(25% - 50px)', y: 'calc(16px + 5vh)' }, width: 110, height: 110, rotation: -15, zIndex: 25, delay: 0.1 },
  { position: { x: 'calc(75% + 320px - 30px)', y: 'calc(16px + 8vh)' }, width: 100, height: 100, rotation: 18, zIndex: 25, delay: 0.2 },
  { position: { x: 'calc(25% - 35px)', y: 'calc(100vh - 100px)' }, width: 95, height: 95, rotation: 12, zIndex: 25, delay: 0.3 },
  { position: { x: 'calc(75% + 320px - 20px)', y: 'calc(100vh - 120px)' }, width: 105, height: 105, rotation: -10, zIndex: 25, delay: 0.4 },
];

const mobilePetsStickers = [
  { position: { x: '-25px', y: 'calc(16px + 3vh)' }, width: 75, height: 75, rotation: -8, zIndex: 25, delay: 0.1 },
  { position: { x: 'calc(100vw - 85px)', y: 'calc(100vh - 100px)' }, width: 70, height: 70, rotation: 10, zIndex: 25, delay: 0.2 },
];

const generateHistoricalData = (currentData: WeatherData, daysAgo: number): HistoricalDataPoint => {
  const baseTemp = currentData.temp;
  const variation = (Math.random() - 0.5) * 8;
  const seasonalAdjustment = Math.sin((daysAgo / 365) * 2 * Math.PI) * 5;
  
  return {
    date: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000),
    temp: Math.max(-10, Math.min(45, baseTemp + variation + seasonalAdjustment)),
    humidity: Math.max(20, Math.min(100, currentData.humidity + (Math.random() - 0.5) * 20)),
    windSpeed: Math.max(0, Math.min(20, currentData.windSpeed + (Math.random() - 0.5) * 5)),
    condition: currentData.condition
  };
};

const generateForecast = (currentData: WeatherData): ForecastDataPoint[] => {
  const hours = ['Now', '3h', '6h', '9h', '12h', '15h', '18h', '21h', '24h'];
  return hours.map((time, index) => {
    const tempVariation = (Math.random() - 0.5) * 4;
    const hourOfDay = index * 3;
    const dayCycle = Math.sin((hourOfDay / 24) * 2 * Math.PI) * 3;
    
    return {
      time,
      temp: Math.max(-5, Math.min(40, currentData.temp + tempVariation + dayCycle)),
      condition: currentData.condition,
      humidity: Math.max(30, Math.min(95, currentData.humidity + (Math.random() - 0.5) * 15))
    };
  });
};

export const StatisticsView: React.FC<StatisticsViewProps> = ({ pets, settings }) => {
  const [viewMode, setViewMode] = useState<'grid' | 'stats' | 'history'>('grid');

  const stats = useMemo(() => {
    if (pets.length === 0) return null;

    const avgTemp = pets.reduce((sum, p) => sum + p.weather.temp, 0) / pets.length;
    const avgHumidity = pets.reduce((sum, p) => sum + p.weather.humidity, 0) / pets.length;
    const avgWind = pets.reduce((sum, p) => sum + p.weather.windSpeed, 0) / pets.length;
    
    const conditions = pets.reduce((acc, p) => {
      acc[p.weather.condition] = (acc[p.weather.condition] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const mostCommonCondition = Object.entries(conditions).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Unknown';
    
    const happyCount = pets.filter(p => p.mood === 'Happy').length;
    const gloomyCount = pets.length - happyCount;
    
    const hottestPet = pets.reduce((hottest, pet) => 
      pet.weather.temp > hottest.weather.temp ? pet : hottest
    , pets[0]);
    
    const coldestPet = pets.reduce((coldest, pet) => 
      pet.weather.temp < coldest.weather.temp ? pet : coldest
    , pets[0]);

    return {
      avgTemp,
      avgHumidity,
      avgWind,
      mostCommonCondition,
      happyCount,
      gloomyCount,
      hottestPet,
      coldestPet,
      totalPets: pets.length
    };
  }, [pets]);

  return (
    <div className="p-4 md:p-8 min-h-full bg-grid-pattern relative overflow-y-auto overflow-x-hidden">
      <StickerContainer 
        stickers={petsStickers} 
        className="hidden md:block"
      />
      <StickerContainer 
        stickers={mobilePetsStickers} 
        className="block md:hidden"
      />
      <div className="relative z-30 mb-4 md:mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl md:text-3xl font-extrabold text-text flex items-center gap-2 md:gap-3">
            <span className="bg-primary w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl border-2 border-border flex items-center justify-center shadow-pixel-sm relative text-lg md:text-2xl">
              🐾
              <Sticker 
                position={{ x: '-15px', y: '-15px' }} 
                width={50} 
                height={50} 
                rotation={-20}
                zIndex={20}
                delay={0.5}
              />
            </span>
            Statistics
          </h2>
          <div className="flex gap-2 border-2 border-border rounded-lg overflow-hidden shadow-pixel-sm">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-2 md:px-3 py-1.5 text-[10px] md:text-xs font-bold transition-all ${
                viewMode === 'grid' 
                  ? 'bg-primary text-white' 
                  : 'bg-background text-text active:bg-accent/30'
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode('stats')}
              className={`px-2 md:px-3 py-1.5 text-[10px] md:text-xs font-bold transition-all ${
                viewMode === 'stats' 
                  ? 'bg-primary text-white' 
                  : 'bg-background text-text active:bg-accent/30'
              }`}
            >
              Stats
            </button>
            <button
              onClick={() => setViewMode('history')}
              className={`px-2 md:px-3 py-1.5 text-[10px] md:text-xs font-bold transition-all ${
                viewMode === 'history' 
                  ? 'bg-primary text-white' 
                  : 'bg-background text-text active:bg-accent/30'
              }`}
            >
              History
            </button>
          </div>
        </div>
      </div>
      
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 relative z-30">
          {pets.map(pet => (
            <div key={pet.id} className="bg-panel-bg border-2 border-border rounded-lg md:rounded-xl p-3 md:p-4 shadow-pixel-sm flex flex-col items-center gap-3 md:gap-4 active:translate-y-[-1px] transition-transform touch-manipulation">
               <div className="w-16 h-16 md:w-24 md:h-24 flex items-center justify-center">
                 {getWeatherIcon(pet.weather.condition, 64)}
              </div>
              
              <div className="text-center">
                <h3 className="text-lg md:text-xl font-bold text-gray-800">{pet.name}</h3>
                <p className="text-gray-500 flex items-center justify-center gap-1 text-sm md:text-base">
                  <MapPin size={12} className="md:w-3.5 md:h-3.5" /> {pet.country}
                </p>
              </div>

              <div className="w-full bg-gray-100 rounded-md md:rounded-lg p-2 md:p-3 border-2 border-gray-800">
                <div className="flex justify-between text-xs md:text-sm mb-1">
                  <span className="font-bold text-gray-600">Weather</span>
                  <span className="font-bold text-gray-700">{pet.weather.condition}</span>
                </div>
                <div className="flex items-center gap-2 text-xs md:text-sm">
                  <Thermometer size={12} className="text-red-500" />
                  <span>{settings.convertTemp(pet.weather.temp).toFixed(1)}{settings.getTempUnit()}</span>
                  <Droplets size={12} className="text-blue-500 ml-2" />
                  <span>{pet.weather.humidity}%</span>
                </div>
              </div>
            </div>
          ))}

          <div className="border-4 border-dashed border-gray-300 rounded-lg md:rounded-xl p-3 md:p-4 flex flex-col items-center justify-center min-h-[200px] md:min-h-[250px] cursor-pointer active:bg-gray-50 transition-colors group touch-manipulation">
            <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mb-3 md:mb-4 group-active:scale-110 transition-transform">
              <span className="text-3xl md:text-4xl">+</span>
            </div>
            <p className="font-bold text-gray-400 group-active:text-gray-600 text-sm md:text-base">Adopt New Pet</p>
          </div>
        </div>
      ) : viewMode === 'stats' && stats ? (
        <div className="space-y-4 md:space-y-6 relative z-30">
          <div className="bg-panel-bg border-2 border-border rounded-lg md:rounded-xl p-4 md:p-6 shadow-pixel-sm">
            <h3 className="text-lg md:text-xl font-black text-text mb-4 flex items-center gap-2">
              <TrendingUp size={20} className="text-primary" />
              Overall Statistics
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              <div className="bg-background rounded-lg border-2 border-border p-3 text-center">
                <div className="text-2xl md:text-3xl font-black text-text">{stats.totalPets}</div>
                <div className="text-xs md:text-sm font-bold text-text/60 mt-1">Total Pets</div>
              </div>
              <div className="bg-background rounded-lg border-2 border-border p-3 text-center">
                <div className="text-2xl md:text-3xl font-black text-green-500">{stats.happyCount}</div>
                <div className="text-xs md:text-sm font-bold text-text/60 mt-1">Happy</div>
              </div>
              <div className="bg-background rounded-lg border-2 border-border p-3 text-center">
                <div className="text-2xl md:text-3xl font-black text-blue-500">{stats.gloomyCount}</div>
                <div className="text-xs md:text-sm font-bold text-text/60 mt-1">Gloomy</div>
              </div>
              <div className="bg-background rounded-lg border-2 border-border p-3 text-center">
                <div className="text-lg md:text-xl font-black text-text">{stats.mostCommonCondition}</div>
                <div className="text-xs md:text-sm font-bold text-text/60 mt-1">Most Common</div>
              </div>
            </div>
          </div>

          <div className="bg-panel-bg border-2 border-border rounded-lg md:rounded-xl p-4 md:p-6 shadow-pixel-sm">
            <h3 className="text-lg md:text-xl font-black text-text mb-4 flex items-center gap-2">
              <Thermometer size={20} className="text-red-500" />
              Weather Averages
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
              <div className="bg-background rounded-lg border-2 border-border p-4 flex items-center gap-3">
                <Thermometer size={24} className="text-red-500" />
                <div>
                  <div className="text-xl md:text-2xl font-black text-text">{settings.convertTemp(stats.avgTemp).toFixed(1)}{settings.getTempUnit()}</div>
                  <div className="text-xs md:text-sm font-bold text-text/60">Avg Temperature</div>
                </div>
              </div>
              <div className="bg-background rounded-lg border-2 border-border p-4 flex items-center gap-3">
                <Droplets size={24} className="text-blue-500" />
                <div>
                  <div className="text-xl md:text-2xl font-black text-text">{stats.avgHumidity.toFixed(0)}%</div>
                  <div className="text-xs md:text-sm font-bold text-text/60">Avg Humidity</div>
                </div>
              </div>
              <div className="bg-background rounded-lg border-2 border-border p-4 flex items-center gap-3">
                <Wind size={24} className="text-gray-500" />
                <div>
                  <div className="text-xl md:text-2xl font-black text-text">{settings.convertWindSpeed(stats.avgWind).toFixed(1)} {settings.getWindSpeedUnit()}</div>
                  <div className="text-xs md:text-sm font-bold text-text/60">Avg Wind Speed</div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div className="bg-panel-bg border-2 border-border rounded-lg md:rounded-xl p-4 md:p-6 shadow-pixel-sm">
              <h3 className="text-base md:text-lg font-black text-text mb-3 flex items-center gap-2">
                <TrendingUp size={18} className="text-red-500" />
                Hottest Location
              </h3>
              <div className="bg-background rounded-lg border-2 border-border p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div>
                    {getWeatherIcon(stats.hottestPet.weather.condition, 48)}
                  </div>
                  <div>
                    <div className="text-lg md:text-xl font-black text-text">{stats.hottestPet.name}</div>
                    <div className="text-xs md:text-sm font-bold text-text/60 flex items-center gap-1">
                      <MapPin size={12} /> {stats.hottestPet.country}
                    </div>
                  </div>
                </div>
                <div className="text-2xl md:text-3xl font-black text-red-500">
                  {settings.convertTemp(stats.hottestPet.weather.temp).toFixed(1)}{settings.getTempUnit()}
                </div>
              </div>
            </div>

            <div className="bg-panel-bg border-2 border-border rounded-lg md:rounded-xl p-4 md:p-6 shadow-pixel-sm">
              <h3 className="text-base md:text-lg font-black text-text mb-3 flex items-center gap-2">
                <TrendingDown size={18} className="text-blue-500" />
                Coldest Location
              </h3>
              <div className="bg-background rounded-lg border-2 border-border p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div>
                    {getWeatherIcon(stats.coldestPet.weather.condition, 48)}
                  </div>
                  <div>
                    <div className="text-lg md:text-xl font-black text-text">{stats.coldestPet.name}</div>
                    <div className="text-xs md:text-sm font-bold text-text/60 flex items-center gap-1">
                      <MapPin size={12} /> {stats.coldestPet.country}
                    </div>
                  </div>
                </div>
                <div className="text-2xl md:text-3xl font-black text-blue-500">
                  {settings.convertTemp(stats.coldestPet.weather.temp).toFixed(1)}{settings.getTempUnit()}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : viewMode === 'history' && pets.length > 0 ? (
        <div className="space-y-4 md:space-y-6 relative z-30">
          {pets.map(pet => {
            const pastWeek = Array.from({ length: 7 }, (_, i) => generateHistoricalData(pet.weather, 7 - i));
            const oneYearAgo = generateHistoricalData(pet.weather, 365);
            const forecast = generateForecast(pet.weather);
            const currentTemp = settings.convertTemp(pet.weather.temp);
            const yearAgoTemp = settings.convertTemp(oneYearAgo.temp);
            const tempDiff = currentTemp - yearAgoTemp;

            return (
              <div key={pet.id} className="bg-panel-bg border-2 border-border rounded-lg md:rounded-xl p-4 md:p-6 shadow-pixel-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div>
                    {getWeatherIcon(pet.weather.condition, 48)}
                  </div>
                  <div>
                    <h3 className="text-lg md:text-xl font-black text-text">{pet.name}</h3>
                    <p className="text-xs md:text-sm font-bold text-text/60 flex items-center gap-1">
                      <MapPin size={12} /> {pet.country}
                    </p>
                  </div>
                </div>

                <div className="space-y-4 md:space-y-6">
                  <div>
                    <h4 className="text-sm md:text-base font-black text-text mb-3 flex items-center gap-2">
                      <Clock size={16} className="text-primary" />
                      24h Forecast
                    </h4>
                    <div className="grid grid-cols-3 md:grid-cols-5 gap-2 md:gap-3">
                      {forecast.map((point, idx) => (
                        <div key={idx} className="bg-background rounded-lg border-2 border-border p-2 text-center">
                          <div className="text-[10px] md:text-xs font-bold text-text/60 mb-1">{point.time}</div>
                          <div className="text-sm md:text-base font-black text-text">{settings.convertTemp(point.temp).toFixed(0)}°</div>
                          <div className="text-[8px] md:text-[10px] text-text/50">{point.humidity}%</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm md:text-base font-black text-text mb-3 flex items-center gap-2">
                      <Calendar size={16} className="text-primary" />
                      Past Week
                    </h4>
                    <div className="grid grid-cols-7 gap-2">
                      {pastWeek.map((day, idx) => (
                        <div key={idx} className="bg-background rounded-lg border-2 border-border p-2 text-center">
                          <div className="text-[8px] md:text-[10px] font-bold text-text/60 mb-1">
                            {day.date.toLocaleDateString('en-US', { weekday: 'short' })}
                          </div>
                          <div className="text-xs md:text-sm font-black text-text">{settings.convertTemp(day.temp).toFixed(0)}°</div>
                          <div className="text-[8px] text-text/50">{day.humidity}%</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm md:text-base font-black text-text mb-3 flex items-center gap-2">
                      <History size={16} className="text-primary" />
                      Year Over Year Comparison
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                      <div className="bg-background rounded-lg border-2 border-border p-3 md:p-4">
                        <div className="text-xs md:text-sm font-bold text-text/60 mb-2">Today</div>
                        <div className="text-xl md:text-2xl font-black text-text">{currentTemp.toFixed(1)}{settings.getTempUnit()}</div>
                        <div className="text-xs md:text-sm font-bold text-text/60 mt-1">{pet.weather.condition}</div>
                      </div>
                      <div className="bg-background rounded-lg border-2 border-border p-3 md:p-4">
                        <div className="text-xs md:text-sm font-bold text-text/60 mb-2">
                          {oneYearAgo.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} (1 year ago)
                        </div>
                        <div className="text-xl md:text-2xl font-black text-text">{yearAgoTemp.toFixed(1)}{settings.getTempUnit()}</div>
                        <div className="text-xs md:text-sm font-bold text-text/60 mt-1">{oneYearAgo.condition}</div>
                      </div>
                    </div>
                    <div className="mt-3 md:mt-4 bg-background rounded-lg border-2 border-border p-3 md:p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs md:text-sm font-bold text-text/60">Temperature Change</span>
                        <span className={`text-base md:text-lg font-black flex items-center gap-1 ${
                          tempDiff > 0 ? 'text-red-500' : tempDiff < 0 ? 'text-blue-500' : 'text-text'
                        }`}>
                          {tempDiff > 0 ? <TrendingUp size={16} /> : tempDiff < 0 ? <TrendingDown size={16} /> : null}
                          {tempDiff > 0 ? '+' : ''}{tempDiff.toFixed(1)}{settings.getTempUnit()}
                        </span>
                      </div>
                      <div className="mt-2 text-xs md:text-sm font-bold text-text/60">
                        {Math.abs(tempDiff) < 1 
                          ? 'Similar to last year' 
                          : tempDiff > 0 
                            ? 'Warmer than last year' 
                            : 'Cooler than last year'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center text-gray-400 font-bold py-12 relative z-30">
          No pets to analyze. Add some pets first!
        </div>
      )}
    </div>
  );
};

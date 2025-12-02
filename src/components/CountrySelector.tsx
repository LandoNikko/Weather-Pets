import React, { useState } from 'react';
import { Plus, Minus, Search, Star } from 'lucide-react';
import { WeatherData } from '../types';
import { WorldMap } from './WorldMap';
import { getWeatherIcon } from '../utils/weatherIcons';
import { Sticker } from './Sticker';
import { SettingsContextType } from '../context/SettingsContext';

interface CountrySelectorProps {
  availableCountries: Array<{ id: string, name: string, weather: WeatherData }>;
  activePetIds: string[];
  onAddPet: (countryId: string) => void;
  onRemovePet: (countryId: string) => void;
  showFlags: boolean;
  settings: SettingsContextType;
}

const getFlag = (countryName: string) => {
  const map: Record<string, string> = {
    'France': '🇫🇷', 'Japan': '🇯🇵', 'USA': '🇺🇸', 'UK': '🇬🇧', 
    'Brazil': '🇧🇷', 'Australia': '🇦🇺', 'Canada': '🇨🇦', 
    'India': '🇮🇳', 'Egypt': '🇪🇬', 'Russia': '🇷🇺',
    'Iceland': '🇮🇸', 'Norway': '🇳🇴', 'Spain': '🇪🇸', 'Germany': '🇩🇪',
    'Mexico': '🇲🇽', 'Argentina': '🇦🇷', 'China': '🇨🇳', 'Italy': '🇮🇹'
  };
  return map[countryName] || '🏳️';
};

const FlagEmoji: React.FC<{ countryName: string }> = ({ countryName }) => {
  const flag = getFlag(countryName);
  return (
    <span style={{ fontFamily: 'Noto Color Emoji, Apple Color Emoji, Segoe UI Emoji, sans-serif' }}>
      {flag}
    </span>
  );
};

export const CountrySelector: React.FC<CountrySelectorProps> = ({
  availableCountries,
  activePetIds,
  onAddPet,
  onRemovePet,
  showFlags,
  settings
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleMapClick = (countryName: string) => {
    const targetId = countryName.toLowerCase();
    const matchedCountry = availableCountries.find(c => c.id.toLowerCase() === targetId || c.name.toLowerCase() === countryName.toLowerCase());

    if (matchedCountry) {
      const isActive = activePetIds.includes(matchedCountry.id);
      if (isActive) {
        onRemovePet(matchedCountry.id);
      } else {
        onAddPet(matchedCountry.id);
      }
    }
  };

  const activeCountries = availableCountries.filter(c => activePetIds.includes(c.id));
  const inactiveCountries = availableCountries.filter(c => 
    !activePetIds.includes(c.id) && 
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeCountryNames = activeCountries.map(c => c.name);

  return (
    <div className="w-full h-full flex flex-col bg-background relative">
      <Sticker 
        position={{ x: '-20px', y: '5%' }} 
        width={80} 
        height={80} 
        rotation={-12}
        zIndex={25}
        delay={0.6}
      />
      <div className="p-2 md:p-4 border-b-2 md:border-b-4 border-border bg-background shrink-0 relative z-30">
        <div className="hidden md:block">
          <WorldMap 
             activeCountryNames={activeCountryNames} 
             onCountryClick={handleMapClick} 
          />
        </div>

        <div className="relative mt-2 md:mt-4">
          <Search size={12} className="absolute left-2 md:left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search countries..." 
            className="w-full bg-panel-bg border-2 border-border pl-7 md:pl-9 pr-2 md:pr-3 py-1.5 md:py-1 text-xs md:text-sm focus:outline-none focus:bg-white transition-colors font-bold text-text placeholder:font-normal shadow-pixel-inset rounded-md md:rounded-lg touch-manipulation"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2 md:p-3 space-y-4 md:space-y-6 bg-background relative z-30">
        {activeCountries.length > 0 && (
          <div>
            <h3 className="text-[10px] md:text-xs font-black text-text/50 uppercase tracking-wider mb-1.5 md:mb-2 pr-1 flex items-center justify-end gap-1">
              <Star size={10} className="md:w-3 md:h-3 fill-current" /> Favorites
            </h3>
            <div className="space-y-1.5 md:space-y-2">
              {activeCountries.map(country => (
                <div 
                  key={country.id}
                  className="flex items-center justify-between p-1.5 md:p-2 bg-panel-bg rounded-lg md:rounded-xl border-2 border-border shadow-pixel-sm"
                >
                  <div className="flex items-center gap-2 md:gap-3 overflow-hidden flex-1 min-w-0">
                    <div className="shrink-0">
                      {getWeatherIcon(country.weather.condition, 32)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-xs md:text-sm truncate">
                        {showFlags && <span className="mr-0.5 md:mr-1"><FlagEmoji countryName={country.name} /></span>}
                        {country.name}
                      </div>
                      <div className="text-[10px] md:text-xs text-gray-500 font-semibold">{settings.convertTemp(country.weather.temp).toFixed(0)}{settings.getTempUnit()}</div>
                    </div>
                  </div>
                  <button 
                    onClick={() => onRemovePet(country.id)}
                    className="w-7 h-7 md:w-8 md:h-8 flex items-center justify-center bg-red-100 text-red-500 active:bg-red-200 transition-colors shrink-0 border-2 border-border shadow-sm active:translate-y-[1px] rounded-md md:rounded-lg touch-manipulation"
                  >
                    <Minus size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <h3 className="text-[10px] md:text-xs font-black text-text/50 uppercase tracking-wider mb-1.5 md:mb-2 pr-1 text-right">Available</h3>
          <div className="space-y-1.5 md:space-y-2">
            {inactiveCountries.map(country => (
              <div 
                key={country.id}
                className="flex items-center justify-between p-1.5 md:p-2 bg-white/40 rounded-lg md:rounded-xl border-2 border-transparent active:bg-panel-bg active:border-border active:shadow-pixel-sm transition-all touch-manipulation"
              >
                <div className="flex items-center gap-2 md:gap-3 overflow-hidden flex-1 min-w-0">
                   <div className="shrink-0">
                      {getWeatherIcon(country.weather.condition, 28)}
                   </div>
                   <div className="font-bold text-xs md:text-sm text-gray-600 truncate">
                      {showFlags && <span className="mr-0.5 md:mr-1"><FlagEmoji countryName={country.name} /></span>}
                      {country.name}
                   </div>
                </div>
                <button 
                  onClick={() => onAddPet(country.id)}
                  className="w-6 h-6 md:w-6 md:h-6 flex items-center justify-center bg-success text-green-700 active:bg-green-300 transition-colors shrink-0 border-2 border-green-600 shadow-[1px_1px_0px_0px_rgba(0,0,0,0.2)] active:translate-y-[1px] active:shadow-none rounded-md md:rounded-lg touch-manipulation"
                >
                  <Plus size={12} />
                </button>
              </div>
            ))}
            {inactiveCountries.length === 0 && (
               <div className="text-center text-text/40 text-xs py-4 italic">
                  No matching countries found in database.
               </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

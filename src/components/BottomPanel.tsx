import React from 'react';
import { Pet } from '../types';
import { Thermometer, Wind, Droplets, MapPin, Activity, Smile, List } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getWeatherIcon } from '../utils/weatherIcons';
import { Sticker } from './Sticker';
import { SettingsContextType } from '../context/SettingsContext';

interface BottomPanelProps {
  selectedPet: Pet | null;
  allPets: Pet[];
  onPetSelect: (pet: Pet) => void;
  settings: SettingsContextType;
}

export const BottomPanel: React.FC<BottomPanelProps> = ({ selectedPet, allPets, onPetSelect, settings }) => {

  return (
    <div className="h-full w-full bg-background p-4 flex gap-6 shadow-[0_-4px_0px_0px_rgba(89,74,78,0.05)] relative">
      <Sticker 
        position={{ x: '-25px', y: '-20px' }} 
        width={75} 
        height={75} 
        rotation={-18}
        zIndex={25}
        delay={0.4}
      />
      <Sticker 
        position={{ x: 'calc(100% - 30px)', y: '-15px' }} 
        width={70} 
        height={70} 
        rotation={15}
        zIndex={25}
        delay={0.5}
      />
      <AnimatePresence mode="wait">
        {selectedPet ? (
          <motion.div
            key="stats"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="flex w-full h-full gap-4 md:gap-6 overflow-x-auto items-center relative z-30"
          >
            <div className="w-48 md:w-64 bg-accent/30 rounded-xl md:rounded-2xl border-2 border-border p-2 md:p-4 flex items-center gap-2 md:gap-4 shadow-pixel-sm shrink-0 h-full">
              <div className="shrink-0">
                {getWeatherIcon(selectedPet.weather.condition, 48)}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm md:text-xl font-black text-text truncate">{selectedPet.name}</h3>
                <div className="flex items-center gap-1 text-text/70 font-bold text-xs md:text-sm">
                  <MapPin size={12} /> {selectedPet.country}
                </div>
              </div>
            </div>

            <div className="flex-1 grid grid-cols-2 md:grid-cols-5 gap-2 md:gap-3 min-w-[200px] md:min-w-[400px] h-full">
              <div className="bg-secondary/20 rounded-lg md:rounded-xl border-2 border-border p-1.5 md:p-2 flex flex-col justify-center items-center shadow-pixel-sm active:translate-y-[-1px] transition-transform">
                 <h3 className="text-text/60 font-black text-[8px] md:text-[10px] uppercase tracking-wider mb-0.5 md:mb-1 text-right w-full">Condition</h3>
                 <div className="text-xs md:text-lg font-black text-text text-center leading-tight capitalize">
                   {selectedPet.weather.description}
                 </div>
              </div>

              <div className="bg-primary/20 rounded-lg md:rounded-xl border-2 border-border p-1.5 md:p-2 flex flex-col justify-center items-center shadow-pixel-sm active:translate-y-[-1px] transition-transform">
                 <h3 className="flex items-center gap-0.5 md:gap-1 text-text/60 font-black text-[8px] md:text-[10px] uppercase tracking-wider mb-0.5 md:mb-1 text-right w-full justify-end">
                    <Thermometer size={10} className="md:w-3 md:h-3" /> Temp
                 </h3>
                 <div className="text-sm md:text-xl font-black text-text">
                   {settings.convertTemp(selectedPet.weather.temp).toFixed(1)}{settings.getTempUnit()}
                 </div>
              </div>

               <div className="bg-purple-100 rounded-lg md:rounded-xl border-2 border-border p-1.5 md:p-2 flex flex-col justify-center items-center shadow-pixel-sm active:translate-y-[-1px] transition-transform">
                 <h3 className="flex items-center gap-0.5 md:gap-1 text-text/60 font-black text-[8px] md:text-[10px] uppercase tracking-wider mb-0.5 md:mb-1 text-right w-full justify-end">
                    <Droplets size={10} className="md:w-3 md:h-3" /> Humid
                 </h3>
                 <div className="text-sm md:text-xl font-black text-text">
                   {selectedPet.weather.humidity}%
                 </div>
              </div>

               <div className="bg-success/30 rounded-lg md:rounded-xl border-2 border-border p-1.5 md:p-2 flex flex-col justify-center items-center shadow-pixel-sm active:translate-y-[-1px] transition-transform">
                 <h3 className="flex items-center gap-0.5 md:gap-1 text-text/60 font-black text-[8px] md:text-[10px] uppercase tracking-wider mb-0.5 md:mb-1 text-right w-full justify-end">
                    <Wind size={10} className="md:w-3 md:h-3" /> Wind
                 </h3>
                 <div className="text-sm md:text-xl font-black text-text">
                   {settings.convertWindSpeed(selectedPet.weather.windSpeed).toFixed(1)}<span className="text-[8px] md:text-xs ml-0.5 md:ml-1">{settings.getWindSpeedUnit()}</span>
                 </div>
              </div>

              <div className="bg-accent/30 rounded-lg md:rounded-xl border-2 border-border p-1.5 md:p-2 flex flex-col justify-center items-center shadow-pixel-sm active:translate-y-[-1px] transition-transform">
                 <h3 className="text-text/60 font-black text-[8px] md:text-[10px] uppercase tracking-wider mb-0.5 md:mb-1 text-right w-full">Mood</h3>
                 <div className="flex items-center gap-1.5">
                   <span className="text-lg md:text-2xl">{selectedPet.mood === 'Happy' ? '😊' : '🌧️'}</span>
                   <div className="w-12 md:w-16 bg-gray-300 rounded-full h-2 md:h-2.5 border border-gray-800">
                     <div 
                       className={`h-2 md:h-2.5 rounded-full border-r border-gray-800 ${selectedPet.mood === 'Happy' ? 'bg-green-400' : 'bg-blue-400'}`} 
                       style={{ width: selectedPet.mood === 'Happy' ? '90%' : '40%' }}
                     ></div>
                   </div>
                 </div>
              </div>
            </div>

            <div className="w-64 md:w-80 bg-panel-bg rounded-2xl border-2 border-border p-4 shadow-pixel-sm shrink-0 flex flex-col relative overflow-hidden hidden md:flex h-full justify-center">
               <div className="absolute top-0 right-0 p-2 opacity-5 text-text">
                  <Smile size={100} />
               </div>
               <h3 className="flex items-center gap-2 text-text/50 font-black text-xs uppercase tracking-wider mb-2 z-10">
                  <Activity size={14} /> Mood Analysis
               </h3>
               <p className="font-bold text-text text-lg leading-snug z-10 italic">
                 "{selectedPet.mood === 'Happy' 
                    ? "Ideally suited for a walk! Let's go!" 
                    : "I'd prefer to stay under a blanket..."}"
               </p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="overview"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full h-full flex flex-col relative z-30"
          >
            <div className="flex items-center gap-2 text-text/50 font-bold text-xs uppercase tracking-wider mb-2">
              <List size={16} /> Active Companions
            </div>
            
            <div className="flex-1 flex items-center gap-4 overflow-x-auto pb-2 h-full">
               {allPets.length === 0 ? (
                  <div className="w-full text-center text-gray-400 font-bold flex items-center justify-center h-full">
                    No pets added yet. Add some from the World Map!
                  </div>
               ) : (
                 allPets.map(pet => (
                   <button
                     key={pet.id}
                     onClick={() => onPetSelect(pet)}
                     className="flex-shrink-0 w-36 md:w-48 h-full bg-panel-bg border-2 border-border rounded-lg md:rounded-xl p-2 md:p-3 flex flex-col items-center justify-center gap-1.5 md:gap-2 shadow-pixel-sm active:translate-y-[-1px] active:shadow-md transition-all group touch-manipulation"
                   >
                      <div className="group-active:scale-110 transition-transform">
                        {getWeatherIcon(pet.weather.condition, 40)}
                      </div>
                      <div className="text-center">
                        <div className="font-black text-text text-xs md:text-sm">{pet.name}</div>
                        <div className="text-[10px] md:text-xs font-bold text-text/50">{pet.country}</div>
                      </div>
                      <div className="text-[10px] md:text-xs font-bold bg-background px-1.5 md:px-2 py-0.5 md:py-1 rounded-md md:rounded-lg text-text/70 border border-border/20">
                         {settings.convertTemp(pet.weather.temp).toFixed(0)}{settings.getTempUnit()} • {pet.weather.condition}
                      </div>
                   </button>
                 ))
               )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

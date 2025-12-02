import React, { useState } from 'react';
import { Volume2, Moon, Type, Flag, Thermometer } from 'lucide-react';
import { SettingsContextType } from '../../context/SettingsContext';
import { StickerContainer } from '../StickerContainer';
import { Sticker } from '../Sticker';

interface SettingsViewProps {
  settings: SettingsContextType;
}

const settingsStickers = [
  { position: { x: 'calc(25% - 45px)', y: 'calc(16px + 10vh)' }, width: 115, height: 115, rotation: -18, zIndex: 25, delay: 0.1 },
  { position: { x: 'calc(75% + 320px - 25px)', y: 'calc(16px + 12vh)' }, width: 100, height: 100, rotation: 20, zIndex: 25, delay: 0.2 },
  { position: { x: 'calc(25% - 30px)', y: 'calc(100vh - 100px)' }, width: 90, height: 90, rotation: 15, zIndex: 25, delay: 0.3 },
  { position: { x: 'calc(75% + 320px - 15px)', y: 'calc(100vh - 120px)' }, width: 105, height: 105, rotation: -12, zIndex: 25, delay: 0.4 },
];

const mobileSettingsStickers = [
  { position: { x: '-20px', y: 'calc(16px + 5vh)' }, width: 70, height: 70, rotation: -10, zIndex: 25, delay: 0.1 },
  { position: { x: 'calc(100vw - 75px)', y: 'calc(100vh - 100px)' }, width: 65, height: 65, rotation: 12, zIndex: 25, delay: 0.2 },
];

export const SettingsView: React.FC<SettingsViewProps> = ({ settings }) => {
  const [fontUrl, setFontUrl] = useState('');

  const handleFontSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (fontUrl) {
       const link = document.createElement('link');
       link.href = fontUrl;
       link.rel = 'stylesheet';
       document.head.appendChild(link);
    }
  };

  return (
    <div className="p-4 md:p-8 bg-grid-pattern min-h-full relative overflow-y-auto overflow-x-hidden">
      <StickerContainer 
        stickers={settingsStickers} 
        className="hidden md:block"
      />
      <StickerContainer 
        stickers={mobileSettingsStickers} 
        className="block md:hidden"
      />
      <div className="relative z-30">
        <h2 className="text-2xl md:text-3xl font-extrabold text-text mb-4 md:mb-8 flex items-center gap-2 md:gap-3">
          <span className="bg-blue-200 w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl border-2 border-border flex items-center justify-center shadow-pixel-sm relative text-lg md:text-2xl">
            ⚙️
            <Sticker 
              position={{ x: '-18px', y: '-18px' }} 
              width={55} 
              height={55} 
              rotation={-25}
              zIndex={20}
              delay={0.5}
            />
          </span>
          Settings
        </h2>
      </div>

      <div className="bg-panel-bg border-2 md:border-4 border-border rounded-lg md:rounded-xl p-4 md:p-6 max-w-2xl mx-auto shadow-pixel relative z-30">
        <div className="space-y-4 md:space-y-6">
          <div className="p-3 md:p-4 bg-background rounded-lg md:rounded-xl border-2 border-border relative">
            <Sticker 
              position={{ x: '-25px', y: '-20px' }} 
              width={70} 
              height={70} 
              rotation={-15}
              zIndex={20}
              delay={0.6}
            />
             <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-4 relative z-30">
                <div className="bg-accent p-1.5 md:p-2 rounded-md md:rounded-lg border border-border shrink-0">
                   <Type size={18} className="md:w-6 md:h-6" />
                </div>
                <div className="flex-1 min-w-0">
                   <h3 className="font-bold text-base md:text-lg">Font Lookdev</h3>
                   <p className="text-xs md:text-sm text-gray-500">Inject Google Font URL</p>
                </div>
             </div>
             <form onSubmit={handleFontSubmit} className="flex gap-2 relative z-30">
                <input 
                  type="text" 
                  placeholder="https://fonts.googleapis.com/css2?family=..." 
                  className="flex-1 p-1.5 md:p-2 border-2 border-border rounded-md md:rounded-lg text-xs md:text-sm bg-white font-sans touch-manipulation"
                  value={fontUrl}
                  onChange={(e) => setFontUrl(e.target.value)}
                />
                <button type="submit" className="bg-primary text-text border-2 border-border rounded-md md:rounded-lg px-3 md:px-4 font-bold active:bg-primary-dark transition-colors shadow-sm active:translate-y-[1px] touch-manipulation text-xs md:text-sm">
                   Load
                </button>
             </form>
          </div>

          <div className="flex items-center justify-between p-3 md:p-4 bg-background rounded-lg md:rounded-xl border-2 border-border relative z-30">
            <div className="flex items-center gap-2 md:gap-4 flex-1 min-w-0">
              <div className="bg-red-100 p-1.5 md:p-2 rounded-md md:rounded-lg border border-border shrink-0">
                <Thermometer size={18} className="md:w-6 md:h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-base md:text-lg">Unit System</h3>
                <p className="text-xs md:text-sm text-gray-500">
                  {settings.unitSystem === 'metric' ? 'Celsius & m/s' : 'Fahrenheit & mph'}
                </p>
              </div>
            </div>
            <div className="flex relative shrink-0">
              <button
                onClick={() => settings.unitSystem === 'imperial' && settings.toggleUnitSystem()}
                className={`
                  px-2 md:px-3 py-1 md:py-1.5 border-2 border-border text-[10px] md:text-xs font-bold
                  transition-all shadow-pixel-sm active:translate-y-[1px] active:shadow-none touch-manipulation
                  rounded-l-full
                  ${settings.unitSystem === 'metric'
                    ? 'bg-primary text-white z-10'
                    : 'bg-background text-text active:bg-accent/30'
                  }
                `}
              >
                Metric
              </button>
              <button
                onClick={() => settings.unitSystem === 'metric' && settings.toggleUnitSystem()}
                className={`
                  px-2 md:px-3 py-1 md:py-1.5 border-2 border-border text-[10px] md:text-xs font-bold
                  transition-all shadow-pixel-sm active:translate-y-[1px] active:shadow-none touch-manipulation
                  rounded-r-full -ml-[2px]
                  ${settings.unitSystem === 'imperial'
                    ? 'bg-primary text-white z-10'
                    : 'bg-background text-text active:bg-accent/30'
                  }
                `}
              >
                Imperial
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 md:p-4 bg-background rounded-lg md:rounded-xl border-2 border-border relative z-30">
            <div className="flex items-center gap-2 md:gap-4 flex-1 min-w-0">
              <div className="bg-orange-100 p-1.5 md:p-2 rounded-md md:rounded-lg border border-border shrink-0">
                <Flag size={18} className="md:w-6 md:h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-base md:text-lg">Show Country Flags</h3>
                <p className="text-xs md:text-sm text-gray-500">Display emoji flags next to names</p>
              </div>
            </div>
            <button 
              onClick={settings.toggleFlags}
              className={`w-12 h-7 md:w-14 md:h-8 rounded-full border-2 border-border p-1 cursor-pointer flex transition-colors touch-manipulation shrink-0 ${
                settings.showFlags ? 'bg-success justify-end' : 'bg-gray-300 justify-start'
              }`}
            >
              <div className="w-4 h-4 md:w-5 md:h-5 bg-white rounded-full border border-border shadow-sm"></div>
            </button>
          </div>

          <div className="flex items-center justify-between p-3 md:p-4 bg-background rounded-lg md:rounded-xl border-2 border-border relative z-30">
            <div className="flex items-center gap-2 md:gap-4 flex-1 min-w-0">
              <div className="bg-pink-100 p-1.5 md:p-2 rounded-md md:rounded-lg border border-border shrink-0">
                <Volume2 size={18} className="md:w-6 md:h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-base md:text-lg">Sound Effects</h3>
                <p className="text-xs md:text-sm text-gray-500">Enable cute sounds</p>
              </div>
            </div>
            <div className="w-12 h-7 md:w-14 md:h-8 bg-success rounded-full border-2 border-border p-1 cursor-pointer flex justify-end touch-manipulation shrink-0">
              <div className="w-4 h-4 md:w-5 md:h-5 bg-white rounded-full border border-border shadow-sm"></div>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 md:p-4 bg-background rounded-lg md:rounded-xl border-2 border-border relative z-30">
            <div className="flex items-center gap-2 md:gap-4 flex-1 min-w-0">
              <div className="bg-purple-100 p-1.5 md:p-2 rounded-md md:rounded-lg border border-border shrink-0">
                <Moon size={18} className="md:w-6 md:h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-base md:text-lg">Dark Mode</h3>
                <p className="text-xs md:text-sm text-gray-500">Easier on the eyes</p>
              </div>
            </div>
            <div className="w-12 h-7 md:w-14 md:h-8 bg-gray-300 rounded-full border-2 border-border p-1 cursor-pointer flex justify-start touch-manipulation shrink-0">
              <div className="w-4 h-4 md:w-5 md:h-5 bg-white rounded-full border border-border shadow-sm"></div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

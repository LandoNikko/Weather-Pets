import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { LeftSidebar } from './components/LeftSidebar';
import { CountrySelector } from './components/CountrySelector';
import { BottomPanel } from './components/BottomPanel';
import { RadioPlayer } from './components/RadioPlayer';
import { HomeView } from './components/views/HomeView';
import { StatisticsView } from './components/views/StatisticsView';
import { SettingsView } from './components/views/SettingsView';
import { AboutView } from './components/views/AboutView';
import { useWeather } from './hooks/useWeather';
import { Pet as PetType, WeatherData } from './types';
import { SettingsContextType, UnitSystem } from './context/SettingsContext';
import { StickerContainer } from './components/StickerContainer';
import { GripVertical } from 'lucide-react';

function App() {
  const { weatherData } = useWeather();
  const [activeTab, setActiveTab] = useState('home');
  const [selectedPet, setSelectedPet] = useState<PetType | null>(null);
  const [showFlags, setShowFlags] = useState(true);
  
  const antennaAngleRef = useRef(-35);
  const antennaVelocityRef = useRef(0);
  const antennaIsDraggingRef = useRef(false);
  const antennaRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number>();
  const [unitSystem, setUnitSystem] = useState<UnitSystem>('metric');
  const [activePetIds, setActivePetIds] = useState<string[]>(['france', 'japan']);
  const [pets, setPets] = useState<PetType[]>([]);
  const [mobilePanelHeight, setMobilePanelHeight] = useState(300);
  const [isDragging, setIsDragging] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const dragStartY = useRef(0);
  const dragStartHeight = useRef(300);

  const availableCountries = useMemo(() => 
    Object.keys(weatherData || {}).map((countryName, index) => ({
      id: countryName.toLowerCase(), 
      name: countryName,
      defaultPos: { x: 20 + (index * 10) % 60, y: 20 + (index * 15) % 60 }
    })), [weatherData]
  );

  const settings: SettingsContextType = useMemo(() => ({
    showFlags,
    toggleFlags: () => setShowFlags(prev => !prev),
    unitSystem,
    toggleUnitSystem: () => setUnitSystem(prev => prev === 'metric' ? 'imperial' : 'metric'),
    convertTemp: (celsius: number) => unitSystem === 'imperial' ? (celsius * 9/5) + 32 : celsius,
    convertWindSpeed: (mps: number) => unitSystem === 'imperial' ? mps * 2.237 : mps,
    getTempUnit: () => unitSystem === 'imperial' ? '°F' : '°C',
    getWindSpeedUnit: () => unitSystem === 'imperial' ? 'mph' : 'm/s'
  }), [showFlags, unitSystem]);

  useEffect(() => {
    if (!weatherData) return;

    setPets(prevPets => {
      const currentPets: PetType[] = activePetIds.map(id => {
        const country = availableCountries.find(c => c.id === id);
        const weatherKey = Object.keys(weatherData).find(k => k.toLowerCase() === id);
        const weather = weatherKey ? weatherData[weatherKey] : null;
        
        if (!country || !weather) return null;

        const existingPet = prevPets.find(p => p.id === id);

        return {
          id: country.id,
          name: country.name, 
          country: country.name,
          weather: weather,
          mood: weather.condition === 'Clear' ? 'Happy' : 'Gloomy',
          position: existingPet ? existingPet.position : country.defaultPos
        };
      }).filter((p): p is PetType => p !== null);

      return currentPets;
    });
  }, [weatherData, activePetIds, availableCountries]);

  useEffect(() => {
    if (selectedPet) {
      const updatedSelected = pets.find(p => p.id === selectedPet.id);
      if (updatedSelected) {
        setSelectedPet(updatedSelected);
      } else {
        setSelectedPet(null);
      }
    }
  }, [pets, selectedPet]);

  useEffect(() => {
    const K = 0.5;
    const DAMPING = 0.88;
    const REST_ANGLE = -35;
    
    const animate = () => {
      if (!antennaIsDraggingRef.current && antennaRef.current) {
        const angle = antennaAngleRef.current;
        const displacement = angle - REST_ANGLE;
        
        const force = -K * displacement;
        antennaVelocityRef.current += force;
        antennaVelocityRef.current *= DAMPING;
        
        antennaAngleRef.current += antennaVelocityRef.current;
        
        if (Math.abs(displacement) < 0.05 && Math.abs(antennaVelocityRef.current) < 0.01) {
          antennaAngleRef.current = REST_ANGLE;
          antennaVelocityRef.current = 0;
        }
        
        antennaRef.current.style.transform = `rotate(${antennaAngleRef.current}deg)`;
      }
      
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    
    animationFrameRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const handleAntennaMove = (clientX: number, clientY: number) => {
      if (!antennaIsDraggingRef.current || !antennaRef.current) return;
      
      const rect = antennaRef.current.getBoundingClientRect();
      const baseX = rect.left + 4;
      const baseY = rect.bottom;
      
      const deltaX = clientX - baseX;
      const deltaY = baseY - clientY;
      
      const angle = Math.atan2(deltaX, deltaY) * (180 / Math.PI);
      const clampedAngle = Math.max(-80, Math.min(20, angle));
      
      antennaAngleRef.current = clampedAngle;
      antennaRef.current.style.transform = `rotate(${clampedAngle}deg)`;
      antennaVelocityRef.current = 0;
    };

    const handleMouseMove = (e: MouseEvent) => {
      handleAntennaMove(e.clientX, e.clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches[0]) {
        e.preventDefault();
        handleAntennaMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const handleMouseUp = () => {
      antennaIsDraggingRef.current = false;
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleMouseUp);
    };
  }, []);

  const handleAntennaMouseDown = useCallback((e: React.MouseEvent) => {
    antennaIsDraggingRef.current = true;
    e.preventDefault();
  }, []);

  const handleAntennaTouchStart = useCallback((e: React.TouchEvent) => {
    antennaIsDraggingRef.current = true;
    e.preventDefault();
  }, []);

  const triggerAntennaBoing = useCallback(() => {
    const randomAngle = -35 + (Math.random() - 0.5) * 60;
    antennaAngleRef.current = randomAngle;
    antennaVelocityRef.current = (Math.random() - 0.5) * 5;
    if (antennaRef.current) {
      antennaRef.current.style.transform = `rotate(${randomAngle}deg)`;
    }
  }, []);

  const handlePetClick = useCallback((pet: PetType) => {
    setSelectedPet(pet);
  }, []);

  const handleBackgroundClick = useCallback(() => {
    setSelectedPet(null);
  }, []);

  const handleAddPet = useCallback((countryId: string) => {
    setActivePetIds(prev => prev.includes(countryId) ? prev : [...prev, countryId]);
  }, []);

  const handleRemovePet = useCallback((countryId: string) => {
    setActivePetIds(prev => prev.filter(id => id !== countryId));
  }, []);

  const countrySelectorProps = useMemo(() => {
    if (!weatherData) return null;
    
    return {
      availableCountries: availableCountries
        .map(c => {
          const weatherKey = Object.keys(weatherData).find(k => k.toLowerCase() === c.id);
          return weatherKey ? {
            id: c.id,
            name: c.name,
            weather: weatherData[weatherKey]
          } : null;
        })
        .filter((c): c is { id: string, name: string, weather: WeatherData } => c !== null),
      activePetIds,
      onAddPet: handleAddPet,
      onRemovePet: handleRemovePet,
      showFlags,
      settings
    };
  }, [availableCountries, weatherData, activePetIds, showFlags, settings, handleAddPet, handleRemovePet]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaY = dragStartY.current - e.clientY;
      const newHeight = Math.max(200, Math.min(window.innerHeight * 0.7, dragStartHeight.current + deltaY));
      setMobilePanelHeight(newHeight);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging) return;
      e.preventDefault();
      const touch = e.touches[0];
      const deltaY = dragStartY.current - touch.clientY;
      const newHeight = Math.max(200, Math.min(window.innerHeight * 0.7, dragStartHeight.current + deltaY));
      setMobilePanelHeight(newHeight);
    };

    const handleTouchEnd = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd);
      document.body.style.userSelect = 'none';
      document.body.style.cursor = 'ns-resize';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    };
  }, [isDragging]);

  const handleDragStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    dragStartY.current = clientY;
    dragStartHeight.current = mobilePanelHeight;
  }, [mobilePanelHeight]);

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <HomeView 
            pets={pets} 
            selectedPetId={selectedPet?.id || null} 
            onPetClick={handlePetClick} 
            onBackgroundClick={handleBackgroundClick}
          />
        );
      case 'pets':
        return <StatisticsView pets={pets} settings={settings} />;
      case 'settings':
        return <SettingsView settings={settings} />;
      case 'about':
        return <AboutView />;
      default:
        return <HomeView pets={pets} selectedPetId={selectedPet?.id || null} onPetClick={handlePetClick} onBackgroundClick={handleBackgroundClick} />;
    }
  };

  const appStickers = activeTab === 'home' ? [
    { position: { x: 'calc(20% + 100px)', y: 'calc(100vh - 220px)' }, width: 90, height: 90, rotation: -15, zIndex: 25, delay: 0.1 },
  ] : [];

  const mobileAppStickers = activeTab === 'home' ? [
    { position: { x: 'calc(100vw - 80px)', y: 'calc(100vh - 200px)' }, width: 70, height: 70, rotation: 12, zIndex: 25, delay: 0.1 },
  ] : [];

  return (
    <div className="h-screen w-screen bg-background overflow-hidden flex flex-col md:flex-row p-2 md:p-4 font-sans text-text gap-2 md:gap-4 relative">
      <StickerContainer 
        stickers={appStickers} 
        className="hidden md:block"
      />
      <StickerContainer 
        stickers={mobileAppStickers} 
        className="block md:hidden"
      />
      
      <div className="hidden md:flex h-full z-20 bg-white rounded-2xl border-4 border-border shadow-pixel flex-shrink-0 relative">
        <LeftSidebar activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
      
      <div className="flex-1 flex flex-col gap-2 md:gap-4 h-full overflow-hidden relative min-w-0 pb-20 md:pb-0">
        <main className={`flex-1 relative rounded-xl md:rounded-2xl border-2 md:border-4 border-border bg-background shadow-pixel min-h-0 ${
          activeTab === 'home' ? 'overflow-hidden' : 'overflow-y-auto overflow-x-hidden'
        }`}>
          <div className="absolute inset-0 bg-grid-pattern pointer-events-none" />
          {renderContent()}
        </main>
        
        {activeTab === 'home' && (
          <div className="h-40 md:h-48 shrink-0 rounded-xl md:rounded-2xl border-2 md:border-4 border-border bg-background shadow-pixel overflow-hidden p-[2px] relative mb-20 md:mb-0">
            <BottomPanel 
              selectedPet={selectedPet} 
              allPets={pets}
              onPetSelect={setSelectedPet}
              settings={settings}
            />
          </div>
        )}
      </div>

      {activeTab === 'home' && (
        <>
          <div className="hidden md:flex h-full w-80 z-50 shrink-0 flex-col gap-4 relative">
            <div className="flex-1 rounded-2xl border-4 border-border bg-background shadow-pixel overflow-hidden relative">
              {countrySelectorProps && <CountrySelector {...countrySelectorProps} />}
            </div>
            <div className="shrink-0 relative z-[100]">
              {/* Radio Antenna - positioned outside the radio container */}
              <div 
                ref={antennaRef}
                className="absolute w-1.5 md:w-2 h-24 md:h-28 bg-gradient-to-t from-border to-gray-400 rounded-full shadow-sm z-[9999] select-none"
                style={{ 
                  left: '4px',
                  bottom: 'calc(100% - 24px)',
                  transform: 'rotate(-35deg)',
                  transformOrigin: 'bottom center',
                  willChange: 'transform',
                  pointerEvents: 'none'
                }}
              >
                <div 
                  className="absolute -top-1.5 md:-top-2 left-1/2 -translate-x-1/2 w-3 md:w-4 h-3 md:h-4 bg-gradient-to-br from-red-400 to-red-600 rounded-full shadow-md border border-red-700 cursor-grab active:cursor-grabbing"
                  style={{ pointerEvents: 'auto' }}
                  onMouseDown={handleAntennaMouseDown}
                  onTouchStart={handleAntennaTouchStart}
                ></div>
                <div className="absolute top-1/3 left-0 right-0 h-0.5 bg-gray-600 opacity-30 pointer-events-none"></div>
                <div className="absolute top-2/3 left-0 right-0 h-0.5 bg-gray-600 opacity-30 pointer-events-none"></div>
              </div>
              
              <div className="border-4 border-border bg-background shadow-pixel rounded-2xl overflow-hidden">
                <RadioPlayer onBoing={triggerAntennaBoing} />
              </div>
            </div>
          </div>
          
          <div 
            ref={panelRef}
            className="md:hidden fixed left-0 right-0 z-30 bg-background border-t-4 border-border shadow-[0_-4px_0px_0px_rgba(89,74,78,1)] overflow-hidden flex flex-col transition-none"
            style={{ 
              bottom: '64px',
              height: `${mobilePanelHeight}px`,
              maxHeight: '70vh'
            }}
          >
            <div 
              className="w-full h-8 flex items-center justify-center bg-panel-bg border-b-2 border-border cursor-ns-resize touch-none select-none active:bg-accent/20"
              onMouseDown={handleDragStart}
              onTouchStart={handleDragStart}
            >
              <GripVertical size={20} className="text-text/40" />
            </div>
            <div className="flex-1 overflow-y-auto min-h-0">
              {countrySelectorProps && <CountrySelector {...countrySelectorProps} />}
            </div>
            <div className="border-t-2 border-border shrink-0">
              <RadioPlayer />
            </div>
          </div>
        </>
      )}
      
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-background border-t-4 border-border shadow-[0_-4px_0px_0px_rgba(89,74,78,1)]">
        <LeftSidebar activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </div>
  );
}

export default App;

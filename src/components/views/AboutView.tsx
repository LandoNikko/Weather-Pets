import React from 'react';
import { PostItNote } from './PostItNote';
import { StickerContainer } from '../StickerContainer';
import { Sticker } from '../Sticker';

const aboutStickers = [
  { position: { x: 'calc(25% - 60px)', y: 'calc(16px + 10vh)' }, width: 120, height: 120, rotation: -15, zIndex: 25, delay: 0.1 },
  { position: { x: 'calc(75% + 320px - 20px)', y: 'calc(16px + 20vh)' }, width: 100, height: 100, rotation: 12, zIndex: 25, delay: 0.2 },
  { position: { x: 'calc(75% + 320px - 10px)', y: 'calc(16px + 80vh)' }, width: 110, height: 110, rotation: -8, zIndex: 25, delay: 0.3 },
  { position: { x: 'calc(25% - 50px)', y: 'calc(16px + 85vh)' }, width: 95, height: 95, rotation: 18, zIndex: 25, delay: 0.4 },
];

const mobileStickers = [
  { position: { x: 'calc(50vw - 40px)', y: 'calc(16px + 5vh)' }, width: 80, height: 80, rotation: -5, zIndex: 25, delay: 0.1 },
  { position: { x: 'calc(85vw - 35px)', y: 'calc(16px + 15vh)' }, width: 70, height: 70, rotation: 8, zIndex: 25, delay: 0.2 },
  { position: { x: 'calc(10vw - 37px)', y: 'calc(16px + 90vh)' }, width: 75, height: 75, rotation: -10, zIndex: 25, delay: 0.3 },
];

export const AboutView: React.FC = () => {
  return (
    <div className="p-4 md:p-8 bg-grid-pattern min-h-full flex flex-col items-center justify-center gap-4 md:gap-6 relative overflow-y-auto overflow-x-hidden">
      <StickerContainer 
        stickers={aboutStickers} 
        className="hidden md:block"
      />
      <StickerContainer 
        stickers={mobileStickers} 
        className="block md:hidden"
      />
      
       <div className="max-w-lg w-full relative z-30 px-2 md:px-0">
          <h2 className="text-2xl md:text-3xl font-extrabold text-primary mb-3 md:mb-4 text-center">WEAPI World</h2>
          <p className="text-base md:text-lg font-bold text-gray-600 mb-4 md:mb-6 text-center">
            Weather Pet Companions From Real Data
          </p>
          
          <div className="bg-yellow-50 p-4 md:p-6 rounded-lg md:rounded-xl border-2 border-gray-800 mb-4 md:mb-6 text-left relative">
            <Sticker 
              position={{ x: '-30px', y: '-20px' }} 
              width={80} 
              height={80} 
              rotation={-12}
              zIndex={20}
              delay={0.5}
            />
            <Sticker 
              position={{ x: 'calc(100% - 20px)', y: '-15px' }} 
              width={70} 
              height={70} 
              rotation={15}
              zIndex={20}
              delay={0.6}
            />
            
            <p className="mb-4 relative z-30">
              Digital pets whose mood and stats reflect real-time weather data from around the world. 
              Currently tracking <strong>8 countries</strong> including France, Japan, Brazil, Canada, Australia, Norway, Egypt, and more.
            </p>
            <p className="mb-4 relative z-30">
              Built with <strong>React</strong>, <strong>Vite</strong>, <strong>TypeScript</strong>, 
              and <strong>Tailwind CSS</strong>. Pet animations powered by <strong>PixiJS</strong> 
              for smooth canvas rendering. Interactive world map uses <strong>D3.js</strong> with 
              GeoJSON data. UI animations handled by <strong>Framer Motion</strong>. 
              Weather icons are animated SVGs from <strong>Meteocons</strong> by Bas Milius.
              Radio antenna spring physics inspired by <strong>Boing</strong> by Greg Sadetsky.
            </p>
            <p className="text-sm text-gray-600 italic relative z-30">
              Inspired by cute desktop pet aesthetics and retro pixel art design.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 md:gap-4 justify-center relative z-30">
            <PostItNote 
              title="Tech Stack"
              content="React • TypeScript • Vite • Tailwind CSS • PixiJS • D3.js • Framer Motion"
              color="yellow"
              rotation={-2}
            />
            <PostItNote 
              title="Features"
              content="Real-time weather data • Animated weather icons • Interactive 3D globe • Animated pets • Pixel art style"
              color="pink"
              rotation={1.5}
            />
            <PostItNote 
              title="How It Works"
              content="Pets wander around using PixiJS canvas. Weather data updates every 5 seconds. Click countries on the map to add/remove pets."
              color="blue"
              rotation={-1}
            />
          </div>

          <div className="mt-4 md:mt-6 text-center relative z-30">
            <button className="bg-primary active:bg-primary-dark text-white font-bold py-2.5 md:py-3 px-6 md:px-8 rounded-lg md:rounded-xl border-2 border-gray-800 shadow-[4px_4px_0px_0px_rgba(74,74,74,1)] active:translate-y-1 active:shadow-[2px_2px_0px_0px_rgba(74,74,74,1)] transition-all touch-manipulation text-sm md:text-base">
              Check GitHub
            </button>
          </div>
       </div>
    </div>
  );
};


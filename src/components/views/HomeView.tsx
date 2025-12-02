import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Stage, Container, Graphics, Text, useTick } from '@pixi/react';
import { Pet as PetType } from '../../types';
import * as PIXI from 'pixi.js';
import { StickerContainer } from '../StickerContainer';

interface PixiPetProps {
  pet: PetType;
  isSelected: boolean;
  onClick: (pet: PetType) => void;
}

const PixiPet: React.FC<PixiPetProps> = ({ pet, isSelected, onClick }) => {
  const [position, setPosition] = useState(pet.position);
  const [isMoving, setIsMoving] = useState(false);
  const [floatOffset, setFloatOffset] = useState(0);
  const [containerSize, setContainerSize] = useState({ width: window.innerWidth, height: window.innerHeight });

  const moveTarget = useRef<{x: number, y: number} | null>(null);
  const moveTimer = useRef(0);
  const timeOffset = useRef(Math.random() * 100);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    const updateSize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setContainerSize({ width: window.innerWidth, height: window.innerHeight });
      }, 150);
    };
    window.addEventListener('resize', updateSize);
    return () => {
      window.removeEventListener('resize', updateSize);
      clearTimeout(timeoutId);
    };
  }, []);

  useTick((delta) => {
    timeOffset.current += 0.05 * delta;
    setFloatOffset(Math.sin(timeOffset.current) * 5);

    moveTimer.current += delta;
    
    if (!isMoving && moveTimer.current > 200 + Math.random() * 300) {
      if (Math.random() > 0.3) {
         const targetX = Math.max(10, Math.min(90, position.x + (Math.random() - 0.5) * 30));
         const targetY = Math.max(10, Math.min(90, position.y + (Math.random() - 0.5) * 30));
         moveTarget.current = { x: targetX, y: targetY };
         setIsMoving(true);
      }
      moveTimer.current = 0;
    }

    if (isMoving && moveTarget.current) {
       const speed = 0.1 * delta;
       const dx = moveTarget.current.x - position.x;
       const dy = moveTarget.current.y - position.y;
       const distance = Math.sqrt(dx*dx + dy*dy);

       if (distance < 0.5) {
         setIsMoving(false);
         moveTarget.current = null;
       } else {
         setPosition((prev: { x: number; y: number }) => ({
            x: prev.x + (dx / distance) * speed,
            y: prev.y + (dy / distance) * speed
         }));
       }
    }
  });

  const drawPet = useCallback((g: PIXI.Graphics) => {
    g.clear();
    
    let color = 0xffcbc7;
    if (pet.weather.condition === 'Clear') color = 0xfdf4c4;
    if (pet.weather.condition === 'Rain') color = 0xd4e6f7;
    if (pet.weather.condition === 'Clouds') color = 0xe0e0e0;
    
    g.beginFill(0x594a4e);
    g.drawCircle(4, 4, 40);
    g.endFill();

    g.lineStyle(3, 0x594a4e, 1);
    g.beginFill(color);
    g.drawCircle(0, 0, 40);
    g.endFill();

    g.beginFill(0x594a4e);
    g.drawCircle(-12, -5, 4);
    g.drawCircle(12, -5, 4);
    g.endFill();

    g.lineStyle(3, 0x594a4e, 1);
    if (pet.mood === 'Happy') {
       g.arc(0, 5, 10, 0.2, Math.PI - 0.2);
    } else {
       g.arc(0, 15, 10, Math.PI + 0.2, -0.2);
    }

    if (isSelected) {
       g.lineStyle(2, 0xffffff, 0.8);
       g.drawCircle(0, 0, 45);
    }
  }, [pet, isSelected]);
  
  return (
    <Container 
       x={containerSize.width * (position.x / 100)} 
       y={(containerSize.height * 0.8) * (position.y / 100) + floatOffset}
       scale={{ x: isSelected ? 1.2 : 1, y: isSelected ? 1.2 : 1 }}
       eventMode="static"
       cursor="pointer"
       pointerdown={(e) => {
         e.stopPropagation();
         onClick(pet);
       }}
    >
       <Graphics draw={drawPet} />
       
       <Container y={50}>
          <Graphics 
            draw={(g) => {
               g.clear();
               g.beginFill(0xffffff);
               g.lineStyle(2, 0x594a4e);
               g.drawRoundedRect(-30, 0, 60, 20, 10);
               g.endFill();
            }} 
          />
          <Text 
            text={pet.name} 
            anchor={0.5} 
            x={0} 
            y={10}
            style={new PIXI.TextStyle({
               fontFamily: 'Nunito',
               fontSize: 12,
               fontWeight: 'bold',
               fill: '#594a4e',
            })}
          />
       </Container>
    </Container>
  );
};

interface HomeViewProps {
  pets: PetType[];
  selectedPetId: string | null;
  onPetClick: (pet: PetType) => void;
  onBackgroundClick: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ 
  pets, 
  selectedPetId, 
  onPetClick, 
  onBackgroundClick 
}) => {
  const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });
  
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setDimensions({ width: window.innerWidth, height: window.innerHeight });
      }, 150);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
    };
  }, []);

  const homeStickers = [
    { position: { x: 'calc(25% - 40px)', y: 'calc(16px + 10%)' }, width: 100, height: 100, rotation: -12, zIndex: 25, delay: 0.1 },
    { position: { x: 'calc(75% + 320px - 20px)', y: 'calc(16px + 15%)' }, width: 90, height: 90, rotation: 15, zIndex: 25, delay: 0.2 },
    { position: { x: 'calc(25% - 30px)', y: 'calc(100vh - 200px)' }, width: 85, height: 85, rotation: 10, zIndex: 25, delay: 0.3 },
    { position: { x: 'calc(75% + 320px - 10px)', y: 'calc(100vh - 220px)' }, width: 95, height: 95, rotation: -18, zIndex: 25, delay: 0.4 },
  ];

  const mobileHomeStickers = [
    { position: { x: '-20px', y: 'calc(16px + 5%)' }, width: 70, height: 70, rotation: -8, zIndex: 25, delay: 0.1 },
    { position: { x: 'calc(100vw - 80px)', y: 'calc(100vh - 200px)' }, width: 65, height: 65, rotation: 12, zIndex: 25, delay: 0.2 },
  ];

  const stageRef = useRef<any>(null);

  return (
    <div className="w-full h-full relative bg-grid-pattern overflow-hidden">
      <StickerContainer 
        stickers={homeStickers} 
        className="hidden md:block"
      />
      <StickerContainer 
        stickers={mobileHomeStickers} 
        className="block md:hidden"
      />
      <Stage 
        ref={stageRef}
        width={dimensions.width} 
        height={dimensions.height} 
        options={{ 
          backgroundAlpha: 0, 
          antialias: true,
          backgroundColor: 0xf3f3e9
        }}
        style={{ position: 'absolute', inset: 0, zIndex: 30 }}
      >
        <Container
          eventMode="passive"
          hitArea={new PIXI.Rectangle(0, 0, dimensions.width, dimensions.height)}
          pointerdown={(e) => {
            e.stopPropagation();
            onBackgroundClick();
          }}
        />
        {pets.map(pet => (
            <PixiPet 
               key={pet.id}
               pet={pet}
               isSelected={selectedPetId === pet.id}
               onClick={onPetClick}
            />
        ))}
      </Stage>
    </div>
  );
};

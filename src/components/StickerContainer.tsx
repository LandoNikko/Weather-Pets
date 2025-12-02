import React from 'react';
import { Sticker } from './Sticker';

interface StickerConfig {
  src?: string;
  alt?: string;
  width?: number;
  height?: number;
  position: { x: number | string; y: number | string };
  rotation?: number;
  zIndex?: number;
  delay?: number;
}

interface StickerContainerProps {
  stickers: StickerConfig[];
  className?: string;
}

export const StickerContainer: React.FC<StickerContainerProps> = ({
  stickers,
  className = '',
}) => {
  return (
    <div className={`fixed inset-0 pointer-events-none ${className}`} style={{ zIndex: 25 }}>
      {stickers.map((sticker, index) => (
        <Sticker
          key={index}
          src={sticker.src}
          alt={sticker.alt}
          width={sticker.width}
          height={sticker.height}
          position={sticker.position}
          rotation={sticker.rotation}
          zIndex={sticker.zIndex}
          delay={sticker.delay}
        />
      ))}
    </div>
  );
};

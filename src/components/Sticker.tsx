import React from 'react';
import { motion } from 'framer-motion';

interface StickerProps {
  src?: string;
  alt?: string;
  width?: number;
  height?: number;
  position: { x: number | string; y: number | string };
  rotation?: number;
  zIndex?: number;
  className?: string;
  delay?: number;
}

export const Sticker: React.FC<StickerProps> = ({
  src,
  alt = 'Sticker',
  width = 100,
  height = 100,
  position,
  rotation = 0,
  zIndex = 1,
  className = '',
  delay = 0,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, rotate: rotation - 10 }}
      animate={{ opacity: 1, scale: 1, rotate: rotation }}
      transition={{ 
        duration: 0.6, 
        delay,
        type: 'spring',
        stiffness: 200,
        damping: 15
      }}
      className={`absolute pointer-events-none ${className}`}
      style={{
        left: typeof position.x === 'string' ? position.x : `${position.x}px`,
        top: typeof position.y === 'string' ? position.y : `${position.y}px`,
        width: `${width}px`,
        height: `${height}px`,
        zIndex,
        transform: `rotate(${rotation}deg)`,
      }}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-contain drop-shadow-lg"
          draggable={false}
          loading="lazy"
        />
      ) : (
        <div className="w-full h-full bg-white/90 border-2 border-gray-300/50 rounded-lg shadow-md flex items-center justify-center backdrop-blur-sm">
          <span className="text-xs text-gray-400 font-bold opacity-60">Sticker</span>
        </div>
      )}
    </motion.div>
  );
};

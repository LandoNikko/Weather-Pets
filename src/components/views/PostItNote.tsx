import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Sticker } from '../Sticker';

interface PostItNoteProps {
  title: string;
  content: string;
  color?: 'yellow' | 'pink' | 'blue' | 'green';
  rotation?: number;
}

const colorClasses = {
  yellow: {
    bg: 'bg-yellow-200',
    border: 'border-yellow-400',
    sticky: 'bg-yellow-300',
  },
  pink: {
    bg: 'bg-pink-200',
    border: 'border-pink-400',
    sticky: 'bg-pink-300',
  },
  blue: {
    bg: 'bg-blue-200',
    border: 'border-blue-400',
    sticky: 'bg-blue-300',
  },
  green: {
    bg: 'bg-green-200',
    border: 'border-green-400',
    sticky: 'bg-green-300',
  },
};

export const PostItNote: React.FC<PostItNoteProps> = ({ 
  title, 
  content, 
  color = 'yellow',
  rotation
}) => {
  const colors = colorClasses[color];
  const finalRotation = useMemo(() => rotation ?? (Math.random() * 6 - 3), [rotation]);

  return (
    <motion.div
      initial={{ rotate: finalRotation - 5, opacity: 0, y: 20 }}
      animate={{ rotate: finalRotation, opacity: 1, y: 0 }}
      transition={{ duration: 0.5, type: 'spring', stiffness: 200 }}
      className={`
        ${colors.bg}
        ${colors.border}
        border-2 p-4 shadow-[4px_4px_12px_rgba(0,0,0,0.2)]
        transform transition-all cursor-default
        max-w-xs w-full relative
        font-sans
      `}
      style={{
        transform: `rotate(${finalRotation}deg)`,
      }}
    >
      <div className="relative h-full">
        <Sticker 
          position={{ x: 'calc(100% - 20px)', y: '-10px' }} 
          width={45} 
          height={45} 
          rotation={finalRotation + 20}
          zIndex={20}
          delay={0.3}
          />
        
        <div className="relative z-10">
          <h3 className="font-black text-base uppercase tracking-wide mb-2 text-gray-800 border-b-2 border-gray-400/50 pb-1">
            {title}
          </h3>
          <p className="text-sm font-bold text-gray-700 leading-relaxed">
            {content}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

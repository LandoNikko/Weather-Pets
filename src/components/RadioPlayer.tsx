import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, Music2, Volume2, VolumeX } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

interface Note {
  id: number;
  x: number;
  delay: number;
  color: string;
}

const songs = [
  { id: 'lofi', name: 'Lofi', videoId: 'jfKfPfyJRdk' },
  { id: 'rain', name: 'Rain', videoId: 'q76bMs-NwRk' },
];

const pastelColors = [
  '#ffcbc7', // coral
  '#fdf4c4', // yellow
  '#d4e6f7', // blue
  '#e0e0e0', // gray
  '#ffb6c1', // pink
  '#dda0dd', // plum
  '#b0e0e6', // powder blue
];

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

interface RadioPlayerProps {
  onBoing?: () => void;
}

export const RadioPlayer: React.FC<RadioPlayerProps> = ({ onBoing }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSong, setCurrentSong] = useState<string | null>('lofi');
  const [notes, setNotes] = useState<Note[]>([]);
  const [playerReady, setPlayerReady] = useState(false);
  const [volume, setVolume] = useState(50);
  const [isMuted, setIsMuted] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [previousVolume, setPreviousVolume] = useState(50);
  const noteIdRef = useRef(0);
  const playerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.YT && window.YT.Player) {
      setPlayerReady(true);
      return;
    }

    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

    const originalCallback = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      if (originalCallback) originalCallback();
      setPlayerReady(true);
    };
  }, []);

  useEffect(() => {
    if (playerReady && window.YT && window.YT.Player && containerRef.current && !playerRef.current) {
      const currentSongData = songs[0];
      try {
        playerRef.current = new window.YT.Player(containerRef.current, {
          videoId: currentSongData.videoId,
          playerVars: {
            autoplay: 0,
            controls: 0,
            disablekb: 1,
            enablejsapi: 1,
            fs: 0,
            iv_load_policy: 3,
            loop: 1,
            modestbranding: 1,
            playlist: currentSongData.videoId,
            rel: 0,
          },
          events: {
            onReady: (event: any) => {
              if (event.target && typeof event.target.setVolume === 'function') {
                event.target.setVolume(50);
              }
            },
          },
        });
      } catch (error) {
        console.error('Failed to initialize YouTube player:', error);
      }
    }
  }, [playerReady]);

  useEffect(() => {
    if (isPlaying && currentSong) {
      const interval = setInterval(() => {
        const newNote: Note = {
          id: noteIdRef.current++,
          x: 20 + Math.random() * 60,
          delay: 0,
          color: pastelColors[Math.floor(Math.random() * pastelColors.length)],
        };
        setNotes(prev => [...prev.slice(-8), newNote]);
      }, 1200);

      return () => clearInterval(interval);
    } else {
      setNotes([]);
    }
  }, [isPlaying, currentSong]);

  const playVideo = useCallback(() => {
    if (playerRef.current) {
      playerRef.current.playVideo();
      onBoing?.();
    }
  }, [onBoing]);

  const handlePlay = useCallback((songId: string) => {
    if (!playerRef.current) return;

    if (currentSong === songId) {
      if (isPlaying) {
        setIsPlaying(false);
        playerRef.current.pauseVideo();
      } else {
        setIsPlaying(true);
        playVideo();
      }
    } else {
      const songData = songs.find(s => s.id === songId);
      if (songData) {
        setCurrentSong(songId);
        setIsPlaying(true);
        playerRef.current.loadVideoById({
          videoId: songData.videoId,
          startSeconds: 0,
        });
        playVideo();
      }
    }
  }, [currentSong, isPlaying, playVideo]);

  const handlePlayPause = useCallback(() => {
    if (!playerRef.current) return;
    
    if (currentSong && isPlaying) {
      setIsPlaying(false);
      playerRef.current.pauseVideo();
    } else if (currentSong) {
      setIsPlaying(true);
      playVideo();
    } else {
      const firstSong = songs[0];
      setCurrentSong(firstSong.id);
      setIsPlaying(true);
      playerRef.current.loadVideoById({
        videoId: firstSong.videoId,
        startSeconds: 0,
      });
      playVideo();
    }
  }, [currentSong, isPlaying, playVideo]);

  useEffect(() => {
    if (playerRef.current && playerReady && typeof playerRef.current.setVolume === 'function') {
      try {
        playerRef.current.setVolume(isMuted ? 0 : volume);
      } catch (error) {
        console.warn('Failed to set volume:', error);
      }
    }
  }, [volume, isMuted, playerReady]);

  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      setVolume(previousVolume);
    } else {
      setPreviousVolume(volume);
      setIsMuted(true);
    }
  };

  const handleKnobMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    e.preventDefault();
  };

  const handleKnobTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    e.preventDefault();
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaY = -e.movementY;
      setVolume(prev => Math.max(0, Math.min(100, prev + deltaY)));
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging || !e.touches[0]) return;
      const touch = e.touches[0];
      const rect = document.body.getBoundingClientRect();
      const centerY = rect.height / 2;
      const deltaY = (centerY - touch.clientY) / 2;
      setVolume(prev => Math.max(0, Math.min(100, prev + deltaY)));
    };

    const handleMouseUp = () => setIsDragging(false);

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('touchend', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div className="bg-panel-bg p-2 md:p-4 relative flex flex-col" style={{ minHeight: 'fit-content' }}>
      
      <div className="flex items-center justify-between mb-2 md:mb-3 relative z-30 gap-2">
        <div className="flex relative flex-1 min-w-0">
          {songs.map((song, index) => (
            <button
              key={song.id}
              onClick={() => handlePlay(song.id)}
              className={`
                flex-1 px-2 md:px-3 py-1 md:py-1.5 border-2 border-border text-[10px] md:text-xs font-bold
                transition-all shadow-pixel-sm active:translate-y-[1px] active:shadow-none touch-manipulation
                ${index === 0 ? 'rounded-l-full' : ''}
                ${index === songs.length - 1 ? 'rounded-r-full' : ''}
                ${index > 0 ? '-ml-[2px]' : ''}
                ${currentSong === song.id
                  ? 'bg-primary text-white z-10'
                  : 'bg-background text-text active:bg-accent/30'
                }
              `}
            >
              {song.name}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1 md:gap-2 shrink-0">
          <Music2 size={12} className="md:w-3.5 md:h-3.5 text-text/60" />
          <h3 className="text-[10px] md:text-xs font-black text-text/60 uppercase tracking-wider hidden sm:block">Radio</h3>
        </div>
      </div>

      <div className="flex items-center justify-between relative z-30 gap-2 md:gap-3">
        <button
          onClick={handlePlayPause}
          className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center bg-primary text-white border-2 border-border rounded-lg shadow-pixel-sm active:translate-y-[1px] active:shadow-none transition-all active:bg-primary-dark touch-manipulation"
          title={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? <Pause size={16} className="md:w-[18px] md:h-[18px]" /> : <Play size={16} className="md:w-[18px] md:h-[18px]" />}
        </button>

        <div className="flex items-center gap-1.5 md:gap-2">
          <div className="flex flex-col items-center gap-0.5">
            <span className="text-[10px] md:text-xs font-bold text-text w-7 md:w-8 text-center">{isMuted ? 0 : volume}</span>
            <button
              onClick={toggleMute}
              className="w-5 h-5 md:w-6 md:h-6 flex items-center justify-center text-text/60 hover:text-text active:text-primary transition-colors touch-manipulation"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX size={14} className="md:w-4 md:h-4" /> : <Volume2 size={14} className="md:w-4 md:h-4" />}
            </button>
          </div>
          
          <div 
            className="relative w-14 h-14 md:w-16 md:h-16 cursor-pointer touch-none select-none"
            onMouseDown={handleKnobMouseDown}
            onTouchStart={handleKnobTouchStart}
          >
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-gray-300 to-gray-500 border-2 border-border shadow-pixel">
              <div className="absolute inset-[4px] md:inset-[5px] rounded-full bg-gradient-to-br from-gray-200 to-gray-400 shadow-[inset_0_1px_3px_rgba(0,0,0,0.2)]">
                <div 
                  className="absolute w-full h-full transition-transform duration-100 ease-out"
                  style={{ transform: `rotate(${(isMuted ? 0 : volume) / 100 * 270 - 135}deg)` }}
                >
                  <div className="absolute top-[6px] md:top-[8px] left-1/2 -translate-x-1/2 w-1.5 md:w-2 h-3 md:h-4 bg-primary rounded-full shadow-sm"></div>
                </div>
                
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-gradient-to-br from-gray-300 to-gray-500 shadow-inner border border-border"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative flex items-center justify-center w-12 h-12 md:w-14 md:h-14 bg-panel-bg rounded-full border-2 border-border shadow-[inset_0_1px_3px_rgba(0,0,0,0.1)] overflow-hidden">
            <img 
              src="/src/assets/speaker-grill.svg" 
              alt="Speaker Grill"
              className="w-10 h-10 md:w-12 md:h-12"
              style={{ filter: 'brightness(0) saturate(100%) invert(28%) sepia(8%) saturate(464%) hue-rotate(314deg) brightness(95%) contrast(90%)' }}
            />
          </div>
        </div>
      </div>

      <div className="absolute right-2 md:right-4 bottom-2 md:bottom-4 w-12 h-12 md:w-14 md:h-14 pointer-events-none overflow-visible z-50">
        <AnimatePresence>
          {notes.map((note) => {
            const randomXOffset = (Math.random() - 0.5) * 80;
            const randomRotation = Math.random() * 360;
            const grillSpawnX = (note.x - 50) * 0.8;
            
            return (
              <motion.div
                key={note.id}
                initial={{ 
                  opacity: 0, 
                  x: grillSpawnX,
                  y: 0,
                  scale: 0.3,
                  rotate: randomRotation
                }}
                animate={{ 
                  opacity: [0, 1, 1, 1, 0],
                  x: grillSpawnX + randomXOffset,
                  y: -150 - Math.random() * 100,
                  scale: [0.3, 0.9, 1.2, 1.1, 0.8],
                  rotate: randomRotation + (Math.random() - 0.5) * 360
                }}
                exit={{ opacity: 0 }}
                transition={{ 
                  duration: 4 + Math.random() * 2,
                  delay: note.delay,
                  ease: 'easeOut'
                }}
                className="absolute text-lg md:text-xl font-bold"
                style={{ 
                  color: note.color,
                  WebkitTextStroke: '0px transparent',
                  left: '50%',
                  top: '50%'
                }}
              >
                ♫
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      <div
        ref={containerRef}
        className="absolute opacity-0 pointer-events-none"
        style={{ width: '1px', height: '1px', border: 'none' }}
      />
    </div>
  );
};

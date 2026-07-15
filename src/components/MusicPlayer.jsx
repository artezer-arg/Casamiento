import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Disc } from 'lucide-react';

export default function MusicPlayer({ config, shouldPlay, onStateChange }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(config?.volumen_inicial ?? 0.5);
  const [isMinimized, setIsMinimized] = useState(true);
  const [prevVolume, setPrevVolume] = useState(config?.volumen_inicial ?? 0.5);

  const cancionUrl = config?.cancion_url || '';
  const cancionNombre = config?.cancion_nombre || 'Nuestra Canción';
  const artista = config?.artista || 'Nestor y Pame';
  const isMusicVisible = config?.visible ?? true;
  const loop = config?.loop ?? true;

  // Sync initial play request from welcome screen
  useEffect(() => {
    if (shouldPlay && audioRef.current) {
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
          setIsMinimized(false);
        })
        .catch(err => {
          console.warn('Audio playback was blocked or failed:', err);
        });
    }
  }, [shouldPlay]);

  // Adjust volume of audio element
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Handle play/pause
  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(err => console.error(err));
    }
    if (onStateChange) onStateChange(!isPlaying);
  };

  // Handle mute
  const toggleMute = () => {
    if (!audioRef.current) return;
    if (isMuted) {
      setIsMuted(false);
      setVolume(prevVolume > 0 ? prevVolume : 0.5);
    } else {
      setPrevVolume(volume);
      setIsMuted(true);
    }
  };

  // Handle volume slider change
  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (val > 0) {
      setIsMuted(false);
    } else {
      setIsMuted(true);
    }
  };

  if (!isMusicVisible || !cancionUrl) return null;

  return (
    <div className={`music-control-floating ${isMinimized ? 'minimized' : ''}`}>
      <audio 
        ref={audioRef} 
        src={cancionUrl} 
        loop={loop} 
        preload="auto"
      />
      
      {/* Vinyl Disc Icon - Toggle minimize on click */}
      <button 
        className="music-btn" 
        style={{ animation: isPlaying ? 'spin 4s linear infinite' : 'none' }}
        onClick={() => setIsMinimized(!isMinimized)}
        title={isMinimized ? "Abrir controles de música" : "Minimizar controles"}
      >
        <Disc size={20} className={isPlaying ? 'animate-spin-slow' : ''} />
      </button>

      {/* Expanded controls wrapper */}
      <div className="music-expanded-controls">
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
          <span className="music-info-text" style={{ fontWeight: 600 }}>{cancionNombre}</span>
          <span className="music-info-text" style={{ fontSize: '0.65rem' }}>{artista}</span>
        </div>

        <button className="music-btn" onClick={togglePlay} style={{ width: '32px', height: '32px' }}>
          {isPlaying ? <Pause size={14} /> : <Play size={14} />}
        </button>

        <button className="music-btn" onClick={toggleMute} style={{ width: '32px', height: '32px' }}>
          {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
        </button>

        <input 
          type="range" 
          min="0" 
          max="1" 
          step="0.05" 
          value={isMuted ? 0 : volume} 
          onChange={handleVolumeChange} 
          className="volume-slider"
        />
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import Welcome from '../components/Welcome';
import Cover from '../components/Cover';
import Frase from '../components/Frase';
import Countdown from '../components/Countdown';
import Details from '../components/Details';
import DressCode from '../components/DressCode';
import Gifts from '../components/Gifts';
import SongSuggester from '../components/SongSuggester';
import SocialLinks from '../components/SocialLinks';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import RSVPModal from '../components/RSVPModal';
import MusicPlayer from '../components/MusicPlayer';
import { Loader } from 'lucide-react';

export default function Invitation() {
  const { currentConfig, currentPhotos, submitRSVP, submitSong, loading } = useAppContext();
  const [hasEntered, setHasEntered] = useState(false);
  const [playMusic, setPlayMusic] = useState(false);
  const [isRSVPOpen, setIsRSVPOpen] = useState(false);

  const handleWelcomeEnter = (withMusic) => {
    setPlayMusic(withMusic);
    setHasEntered(true);
  };

  // Elegant loading view
  if (loading && !currentConfig) {
    return (
      <div 
        style={{ 
          height: '100vh', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center',
          backgroundColor: 'var(--bg-crema)',
          color: 'var(--color-gold)'
        }}
      >
        <Loader className="animate-spin-slow" size={40} />
        <p style={{ marginTop: '1rem', fontFamily: 'var(--font-serif)', color: 'var(--color-olive)', fontStyle: 'italic' }}>
          Preparando tu invitación...
        </p>
      </div>
    );
  }

  // Fallback if config failed to load
  if (!currentConfig) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center', backgroundColor: 'var(--bg-crema)', minHeight: '100vh' }}>
        <p>No se pudo cargar la invitación. Intentá recargar la página.</p>
      </div>
    );
  }

  const nombres = currentConfig.general?.nombres_novios || 'Nestor y Pame';
  const displayNames = nombres.replace(' y ', ' & ');

  return (
    <div className="public-invitation">
      {/* 1. Welcome Screen overlay */}
      {!hasEntered && (
        <Welcome 
          onEnter={handleWelcomeEnter} 
          nombres={displayNames}
        />
      )}

      {/* 2. Main Page Layout (visible only after entering, or styled so that it builds on load) */}
      {hasEntered && (
        <div className="animate-fade-in">
          {/* Cover Header */}
          <Cover config={currentConfig} photos={currentPhotos} />
          
          {/* Emotive phrase */}
          <Frase config={currentConfig} />
          
          {/* Cuenta regresiva */}
          <Countdown config={currentConfig} />
          
          {/* Fecha, lugar, maps, calendario */}
          <Details config={currentConfig} />
          
          {/* Dress code & forbidden colors */}
          <DressCode config={currentConfig} />
          
          {/* Mesa de Regalos */}
          <Gifts config={currentConfig} />
          
          {/* Sugerir canciones */}
          <SongSuggester config={currentConfig} onSubmit={submitSong} />
          
          {/* Instagram & share memories */}
          <SocialLinks config={currentConfig} />
          
          {/* Pie de Página */}
          <Footer config={currentConfig} />
          
          {/* Navigation floating menu */}
          <Navbar onOpenRSVP={() => setIsRSVPOpen(true)} config={currentConfig} />
          
          {/* RSVP Modal */}
          <RSVPModal 
            isOpen={isRSVPOpen} 
            onClose={() => setIsRSVPOpen(false)} 
            onSubmit={submitRSVP}
          />
        </div>
      )}

      {/* 3. Floating Music player controls */}
      <MusicPlayer 
        config={currentConfig.musica} 
        shouldPlay={playMusic} 
      />
    </div>
  );
}

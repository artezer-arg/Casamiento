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
import Guestbook from '../components/Guestbook';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import RSVPModal from '../components/RSVPModal';
import MusicPlayer from '../components/MusicPlayer';
import { Loader, Heart } from 'lucide-react';

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
    <div className="public-invitation-page-wrapper">
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
          

          {/* Fecha, lugar, maps, calendario */}
          <Details config={currentConfig} />
          
          {/* Dress code & forbidden colors */}
          <DressCode config={currentConfig} />
          
          {/* Mesa de Regalos */}
          <Gifts config={currentConfig} />
          
          {/* Confirmación Asistencia (Inline RSVP) */}
          <section id="confirmar-inline" style={{ padding: '2rem 1.5rem', textAlign: 'center' }}>
            <div style={{ color: 'var(--color-gold)', display: 'flex', justifyContent: 'center', marginBottom: '0.5rem' }}>
              <Heart size={28} strokeWidth={1.5} />
            </div>
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.65rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--color-text-muted)', fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}>R.S.V.P</span>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: 'var(--color-text-dark)', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0.35rem 0' }}>Confirmación</h3>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '1.5rem', lineHeight: '1.6', maxWidth: '80%', margin: '0.5rem auto 1.5rem auto' }}>
              Agradecemos confirmar tu asistencia antes del 24 de Octubre de 2026 para una mejor organización de la fiesta.
            </p>
            <button 
              onClick={() => setIsRSVPOpen(true)}
              className="design-btn-dark"
              style={{ width: '90%', justifyContent: 'center', padding: '0.85rem 2rem' }}
            >
              Confirmar Asistencia
            </button>
            <div className="design-separator">
              <Heart size={10} className="design-separator-heart" fill="currentColor" strokeWidth={0} />
            </div>
          </section>

          {/* Sugerir canciones */}
          <SongSuggester config={currentConfig} onSubmit={submitSong} />
          
          {/* Libro de firmas (Mensajes emotivos) */}
          <Guestbook />
          
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
    </div>
  );
}

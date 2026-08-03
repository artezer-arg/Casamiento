import React from 'react';

export default function Frase({ config }) {
  const general = config?.general || {};
  const nombres = general.nombres_novios || 'Nestor y Pame';
  const displayNames = nombres.replace(' y ', ' & ');
  
  const fraseTexto = general.frase_emotiva || 'Hay momentos que se sueñan toda la vida, y queremos vivir este junto a vos.';

  return (
    <section id="frase-emotiva" className="phrase-container" style={{ position: 'relative', overflow: 'hidden', padding: '4rem 1.5rem', textAlign: 'center' }}>
      
      {/* Detailed Eucalyptus watermark background top right */}
      <svg className="bg-leaves bg-leaves-top-right" viewBox="0 0 120 120" fill="none" style={{ opacity: 0.06, width: '180px', height: 'auto', position: 'absolute', top: '-10px', right: '-10px', transform: 'rotate(90deg)', pointerEvents: 'none' }}>
        <path d="M120 0C95 12 70 32 50 62C40 77 35 92 30 112" stroke="#4a5d3b" strokeWidth="1.2" />
        <path d="M100 12C95 6 86 10 90 18C94 26 103 22 99 14Z" fill="#839b7a" fillOpacity="0.4" stroke="#4a5d3b" strokeWidth="0.6"/>
        <path d="M85 24C78 19 72 25 78 32C84 39 90 33 86 26Z" fill="#839b7a" fillOpacity="0.4" stroke="#4a5d3b" strokeWidth="0.6"/>
        <path d="M70 40C64 34 56 38 60 46C64 54 72 50 68 42Z" fill="#839b7a" fillOpacity="0.4" stroke="#4a5d3b" strokeWidth="0.6"/>
        <path d="M55 58C48 52 42 56 46 64C50 72 58 68 54 60Z" fill="#839b7a" fillOpacity="0.4" stroke="#4a5d3b" strokeWidth="0.6"/>
        <path d="M42 78C36 72 30 76 34 84C38 92 46 88 42 80Z" fill="#839b7a" fillOpacity="0.4" stroke="#4a5d3b" strokeWidth="0.6"/>
      </svg>

      <div className="animate-fade-in-up" style={{ maxWidth: '320px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
        
        {/* Detailed eucalyptus leaf and flower branch ornament (Top) */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
          <svg width="100" height="24" viewBox="0 0 100 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ opacity: 0.8 }}>
            <path d="M10,12 C35,16 65,16 90,12" stroke="#4a5d3b" strokeWidth="0.8" strokeLinecap="round" />
            <path d="M22,13 C18,10 16,13 18,16 C20,19 24,16 22,13 Z" fill="#839b7a" fillOpacity="0.35" stroke="#4a5d3b" strokeWidth="0.4" />
            <path d="M30,13 C34,10 36,13 34,16 C32,19 28,16 30,13 Z" fill="#839b7a" fillOpacity="0.35" stroke="#4a5d3b" strokeWidth="0.4" />
            <path d="M42,14 C38,11 36,14 38,17 C40,20 44,17 42,14 Z" fill="#839b7a" fillOpacity="0.3" stroke="#4a5d3b" strokeWidth="0.4" />
            <path d="M50,14 C54,11 56,13 54,16 C52,19 48,16 50,14 Z" fill="#839b7a" fillOpacity="0.3" stroke="#4a5d3b" strokeWidth="0.4" />
            <path d="M62,13 C58,10 56,13 58,16 C60,19 64,16 62,13 Z" fill="#839b7a" fillOpacity="0.35" stroke="#4a5d3b" strokeWidth="0.4" />
            <path d="M70,13 C74,10 76,13 74,16 C72,19 68,16 70,13 Z" fill="#839b7a" fillOpacity="0.35" stroke="#4a5d3b" strokeWidth="0.4" />
            <g transform="translate(50, 12)">
              <circle cx="0" cy="0" r="1.2" fill="var(--color-gold)" />
              <circle cx="-1.5" cy="0" r="0.9" fill="#ffffff" stroke="var(--color-gold)" strokeWidth="0.25" />
              <circle cx="1.5" cy="0" r="0.9" fill="#ffffff" stroke="var(--color-gold)" strokeWidth="0.25" />
              <circle cx="0" cy="-1.5" r="0.9" fill="#ffffff" stroke="var(--color-gold)" strokeWidth="0.25" />
              <circle cx="0" cy="1.5" r="0.9" fill="#ffffff" stroke="var(--color-gold)" strokeWidth="0.25" />
            </g>
          </svg>
        </div>

        <p style={{
          fontFamily: 'var(--font-serif)',
          fontSize: '1.2rem',
          color: 'var(--color-text-dark)',
          lineHeight: '1.6',
          fontStyle: 'italic',
          marginBottom: '1rem'
        }}>
          “{fraseTexto}”
        </p>

        <span style={{
          fontFamily: 'var(--font-sans)',
          fontSize: '0.75rem',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          color: 'var(--color-gold)',
          fontWeight: 600,
          display: 'block'
        }}>
          — {displayNames} —
        </span>

        {/* Detailed eucalyptus leaf and flower branch ornament (Bottom) */}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1.5rem' }}>
          <svg width="100" height="24" viewBox="0 0 100 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ opacity: 0.8 }}>
            <path d="M10,12 C35,16 65,16 90,12" stroke="#4a5d3b" strokeWidth="0.8" strokeLinecap="round" />
            <path d="M22,13 C18,10 16,13 18,16 C20,19 24,16 22,13 Z" fill="#839b7a" fillOpacity="0.35" stroke="#4a5d3b" strokeWidth="0.4" />
            <path d="M30,13 C34,10 36,13 34,16 C32,19 28,16 30,13 Z" fill="#839b7a" fillOpacity="0.35" stroke="#4a5d3b" strokeWidth="0.4" />
            <path d="M42,14 C38,11 36,14 38,17 C40,20 44,17 42,14 Z" fill="#839b7a" fillOpacity="0.3" stroke="#4a5d3b" strokeWidth="0.4" />
            <path d="M50,14 C54,11 56,13 54,16 C52,19 48,16 50,14 Z" fill="#839b7a" fillOpacity="0.3" stroke="#4a5d3b" strokeWidth="0.4" />
            <path d="M62,13 C58,10 56,13 58,16 C60,19 64,16 62,13 Z" fill="#839b7a" fillOpacity="0.35" stroke="#4a5d3b" strokeWidth="0.4" />
            <path d="M70,13 C74,10 76,13 74,16 C72,19 68,16 70,13 Z" fill="#839b7a" fillOpacity="0.35" stroke="#4a5d3b" strokeWidth="0.4" />
            <g transform="translate(50, 12)">
              <circle cx="0" cy="0" r="1.2" fill="var(--color-gold)" />
              <circle cx="-1.5" cy="0" r="0.9" fill="#ffffff" stroke="var(--color-gold)" strokeWidth="0.25" />
              <circle cx="1.5" cy="0" r="0.9" fill="#ffffff" stroke="var(--color-gold)" strokeWidth="0.25" />
              <circle cx="0" cy="-1.5" r="0.9" fill="#ffffff" stroke="var(--color-gold)" strokeWidth="0.25" />
              <circle cx="0" cy="1.5" r="0.9" fill="#ffffff" stroke="var(--color-gold)" strokeWidth="0.25" />
            </g>
          </svg>
        </div>
      </div>

      {/* Detailed Eucalyptus watermark background bottom left */}
      <svg className="bg-leaves bg-leaves-bottom-left" viewBox="0 0 120 120" fill="none" style={{ opacity: 0.06, width: '180px', height: 'auto', position: 'absolute', bottom: '-10px', left: '-10px', transform: 'rotate(-90deg)', pointerEvents: 'none' }}>
        <path d="M0 120C25 108 50 88 70 58C80 43 85 28 90 8" stroke="#4a5d3b" strokeWidth="1.2" />
        <path d="M20 108C25 114 34 110 30 102C26 94 17 98 21 106Z" fill="#839b7a" fillOpacity="0.4" stroke="#4a5d3b" strokeWidth="0.6"/>
        <path d="M35 96C42 101 48 95 42 88C36 81 30 87 34 94Z" fill="#839b7a" fillOpacity="0.4" stroke="#4a5d3b" strokeWidth="0.6"/>
        <path d="M50 80C56 86 64 82 60 74C56 66 48 70 52 78Z" fill="#839b7a" fillOpacity="0.4" stroke="#4a5d3b" strokeWidth="0.6"/>
        <path d="M65 62C72 68 78 64 74 56C70 48 62 52 66 60Z" fill="#839b7a" fillOpacity="0.4" stroke="#4a5d3b" strokeWidth="0.6"/>
      </svg>
    </section>
  );
}

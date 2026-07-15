import React from 'react';

export default function Frase({ config }) {
  const general = config?.general || {};
  const nombres = general.nombres_novios || 'Nestor y Pame';
  const displayNames = nombres.replace(' y ', ' & ');
  
  const fraseTexto = general.frase_emotiva || 'Hay momentos que se sueñan toda la vida, y queremos vivir este junto a vos.';

  return (
    <section id="frase-emotiva" className="phrase-container">
      {/* Botanical foliage framing top right */}
      <svg className="bg-leaves bg-leaves-top-right" viewBox="0 0 100 100" style={{ opacity: 0.08 }}>
        <path d="M10,80 Q50,40 80,10 Q60,40 50,80" fill="none" stroke="currentColor" strokeWidth="2"/>
        <path d="M30,60 Q20,40 10,50 M50,40 Q40,20 30,30" fill="none" stroke="currentColor" strokeWidth="1.5"/>
      </svg>

      <div className="animate-fade-in-up" style={{ maxWidth: '320px', position: 'relative', zIndex: 2 }}>
        {/* Soft elegant separator */}
        <div style={{ color: 'var(--color-gold)', display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
          <svg width="60" height="20" viewBox="0 0 100 30" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M10,15 Q30,5 50,15 T90,15" />
            <circle cx="50" cy="15" r="3" fill="currentColor" />
          </svg>
        </div>

        <p className="phrase-text">
          “{fraseTexto}”
        </p>

        <span className="phrase-signature serif-text">— {displayNames} —</span>

        {/* Soft elegant separator bottom */}
        <div style={{ color: 'var(--color-gold)', display: 'flex', justifyContent: 'center', marginTop: '1.5rem' }}>
          <svg width="60" height="20" viewBox="0 0 100 30" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M10,15 Q30,25 50,15 T90,15" />
            <circle cx="50" cy="15" r="3" fill="currentColor" />
          </svg>
        </div>
      </div>

      {/* Botanical foliage framing bottom left */}
      <svg className="bg-leaves bg-leaves-bottom-left" viewBox="0 0 100 100" style={{ opacity: 0.08 }}>
        <path d="M10,80 Q50,40 80,10 Q60,40 50,80" fill="none" stroke="currentColor" strokeWidth="2"/>
        <path d="M30,60 Q20,40 10,50" fill="none" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    </section>
  );
}

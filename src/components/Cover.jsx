import React from 'react';

export default function Cover({ config, photos }) {
  const nombres = config?.general?.nombres_novios || 'Nestor y Pame';
  const lugar = config?.evento?.lugar || 'Las Moras Eventos';
  const direccion = config?.evento?.direccion || 'Mateo Blanco 369, Campana';

  // Extract city/province for footer location (e.g. CAMPANA, BUENOS AIRES)
  const getLocationText = () => {
    if (direccion.toLowerCase().includes('campana')) {
      return 'CAMPANA, BUENOS AIRES';
    }
    return 'BUENOS AIRES, ARGENTINA';
  };

  // Find cover photo
  const coverPhoto = photos?.find(p => p.tipo === 'portada' && p.visible);
  const coverUrl = coverPhoto?.url || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800';
  const alignment = coverPhoto?.posicion_encuadre || 'center';

  return (
    <div 
      className="cover-container" 
      style={{ 
        backgroundImage: `url(${coverUrl})`,
        backgroundPosition: alignment,
        justifyContent: 'center',
        padding: '2rem 1rem',
        overflow: 'hidden'
      }}
    >
      <div className="cover-overlay" style={{ background: 'linear-gradient(to bottom, rgba(42, 51, 36, 0.3) 0%, rgba(42, 51, 36, 0.6) 100%)' }}></div>
      
      <div className="arch-card-wrapper animate-fade-in-up">
        {/* The arched card inspired by reference image */}
        <div className="arch-card torn-left">
          
          {/* Jagged Torn Paper SVG Edge */}
          <svg className="torn-edge-svg" viewBox="0 0 10 100" preserveAspectRatio="none">
            <path 
              d="M 10,0 
                 L 4,3 L 8,6 L 3,10 L 7,13 L 2,17 L 9,21 L 4,25 L 8,29 L 3,33 L 7,37 L 2,41 L 8,45 L 4,49 L 7,53 L 3,57 L 8,61 L 4,65 L 7,69 L 3,73 L 8,77 L 2,81 L 8,85 L 3,89 L 7,93 L 2,97 L 10,100 Z" 
              fill="#faf7f1" 
            />
          </svg>

          {/* Interactive 3D Gold Wax Seal pinned to the torn seam */}
          <div className="wax-seal" title="Lacre de Confirmación Nestor & Pame">
            <span className="wax-seal-logo">N|P</span>
          </div>

          {/* Delicate leaf branch overlay on the right side */}
          <svg className="floating-side-branch" viewBox="0 0 50 100" fill="currentColor">
            <path d="M10,90 Q15,45 35,10" fill="none" stroke="currentColor" strokeWidth="1" />
            {/* Leaves along the branch */}
            <path d="M15,80 C18,75 12,70 15,65 C18,60 22,65 20,75 Z" />
            <path d="M18,65 C22,60 16,55 19,50 C22,45 26,50 24,60 Z" />
            <path d="M22,50 C26,45 20,40 23,35 C26,30 30,35 28,45 Z" />
            <path d="M26,35 C30,30 24,25 27,20 C30,15 34,20 32,30 Z" />
            <path d="M30,20 C34,15 28,10 31,5 C34,0 38,5 36,15 Z" />
            {/* Left facing leaves */}
            <path d="M12,75 C9,70 15,65 12,60 C9,55 5,60 7,70 Z" />
            <path d="M14,60 C11,55 17,50 14,45 C11,40 7,45 9,55 Z" />
            <path d="M16,45 C13,40 19,35 16,30 C13,25 9,30 11,40 Z" />
            <path d="M18,30 C15,25 21,20 18,15 C15,10 11,15 13,25 Z" />
          </svg>

          {/* Top Wreath Monogram */}
          <div style={{ color: 'var(--color-gold)', display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '0.75rem', zIndex: 2 }}>
            <svg width="46" height="30" viewBox="0 0 100 50" fill="none" stroke="currentColor" strokeWidth="1.2">
              <path d="M15,35 C20,15 45,10 50,22 C55,10 80,15 85,35" />
              {/* Little leaves */}
              <circle cx="25" cy="23" r="1.5" fill="currentColor" />
              <circle cx="35" cy="16" r="1.5" fill="currentColor" />
              <circle cx="45" cy="15" r="1.5" fill="currentColor" />
              <circle cx="55" cy="15" r="1.5" fill="currentColor" />
              <circle cx="65" cy="16" r="1.5" fill="currentColor" />
              <circle cx="75" cy="23" r="1.5" fill="currentColor" />
            </svg>
            <span style={{ fontSize: '0.8rem', letterSpacing: '0.25em', color: 'var(--color-text-dark)', fontWeight: 500, marginTop: '-4px' }}>N | P</span>
          </div>

          {/* Section 1: SAVE THE DATE replaced in Spanish */}
          <h2 className="ref-save-the-date">NUESTRA</h2>
          <span className="script-text" style={{ fontSize: '1.8rem', marginTop: '-0.75rem', marginBottom: '-0.5rem', zIndex: 2 }}>bella</span>
          <h2 className="ref-save-the-date" style={{ marginBottom: '0.5rem' }}>BODA</h2>

          {/* Section 2: FOR THE WEDDING OF */}
          <span className="ref-subheading">PARA EL CASAMIENTO DE</span>

          {/* Section 3: NAMES */}
          <h3 className="ref-names">
            NESTOR 
            <span className="script-text" style={{ display: 'block', fontSize: '2.5rem', margin: '0.1rem 0' }}>y</span> 
            PAME
          </h3>

          {/* Section 4: DATE GRID saturday | 24 | october */}
          <div className="date-columns">
            <span className="date-column-side">Sábado</span>
            <span className="date-column-center">24</span>
            <span className="date-column-side">Octubre</span>
          </div>

          {/* Section 5: DOS MIL VEINTISEIS */}
          <span 
            style={{ 
              fontSize: '0.65rem', 
              letterSpacing: '0.2em', 
              textTransform: 'uppercase', 
              color: 'var(--color-text-muted)',
              fontWeight: 600,
              marginBottom: '1rem'
            }}
          >
            DOS MIL VEINTISÉIS
          </span>

          {/* Section 6: CALLIGRAPHY FOOTER */}
          <span className="script-text" style={{ fontSize: '1.6rem', color: 'var(--color-gold)', marginBottom: '1.25rem' }}>
            Invitación formal a continuación
          </span>

          {/* Section 7: LOCATION */}
          <span className="ref-location">{getLocationText()}</span>

          {/* Section 8: CLASSIC VILLA ENGRAVING */}
          <svg className="line-art-villa" viewBox="0 0 120 40" fill="none" stroke="currentColor" strokeWidth="0.6">
            {/* Ground line */}
            <line x1="10" y1="36" x2="110" y2="36" />
            {/* Villa central building */}
            <rect x="48" y="16" width="24" height="20" />
            <polygon points="46,16 60,8 74,16" />
            <rect x="56" y="26" width="8" height="10" /> {/* Door */}
            {/* Left wing */}
            <rect x="28" y="22" width="20" height="14" />
            <polygon points="26,22 38,16 50,22" />
            {/* Right wing */}
            <rect x="72" y="22" width="20" height="14" />
            <polygon points="70,22 82,16 94,22" />
            {/* Windows details */}
            <circle cx="60" cy="12" r="1.5" />
            <rect x="34" y="26" width="3" height="5" />
            <rect x="41" y="26" width="3" height="5" />
            <rect x="76" y="26" width="3" height="5" />
            <rect x="83" y="26" width="3" height="5" />
            {/* Little trees on the sides */}
            <path d="M18,36 L18,22 C18,22 15,24 15,28 C15,32 18,36 18,36 Z" fill="currentColor" opacity="0.3" />
            <path d="M22,36 L22,18 C22,18 19,21 19,26 C19,31 22,36 22,36 Z" fill="currentColor" opacity="0.3" />
            <path d="M102,36 L102,22 C102,22 99,24 99,28 C99,32 102,36 102,36 Z" fill="currentColor" opacity="0.3" />
            <path d="M98,36 L98,18 C98,18 95,21 95,26 C95,31 98,36 98,36 Z" fill="currentColor" opacity="0.3" />
          </svg>
        </div>
      </div>
    </div>
  );
}

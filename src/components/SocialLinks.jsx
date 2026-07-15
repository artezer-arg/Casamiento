import React from 'react';
import { Camera } from 'lucide-react';

const Instagram = ({ size = 24, strokeWidth = 2, className = '' }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth={strokeWidth} 
    strokeLinecap="round" 
    strokeLinejoin="round"
    className={className}
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

export default function SocialLinks({ config }) {
  const enlaces = config?.enlaces || {};
  
  // Instagram configurations
  const isInstaVisible = enlaces.instagram_visible ?? true;
  const instaUser = enlaces.instagram_user || 'nestorypame2026';
  const instaUrl = enlaces.instagram_url || 'https://instagram.com/nestorypame2026';
  const instaHashtag = enlaces.instagram_hashtag || '#NestoryPame';
  const instaText = enlaces.instagram_text || 'Seguinos en Instagram para compartir la previa del gran día.';

  // Photo sharing configurations
  const isShareVisible = enlaces.compartir_fotos_visible ?? true;
  const shareUrl = enlaces.compartir_fotos_url || 'https://photos.google.com/';
  const shareText = 'Cada mirada cuenta una historia. Compartí con nosotros las fotos y videos que captures durante este día.';

  return (
    <>
      {/* SECTION 1: SHARE PHOTOS */}
      {isShareVisible && (
        <section id="compartir-fotos" style={{ backgroundColor: 'var(--bg-crema-alt)' }}>
          <div className="share-photos-icon-box animate-float">
            <Camera size={32} strokeWidth={1.5} />
          </div>

          <h2 className="section-title">Compartí tus Recuerdos</h2>
          <p className="section-subtitle">Fotos y Videos</p>

          <div className="animate-fade-in-up" style={{ maxWidth: '340px' }}>
            <p style={{ fontSize: '0.95rem', color: 'var(--color-text-muted)', marginBottom: '2rem', lineHeight: '1.6' }}>
              {shareText}
            </p>

            {shareUrl ? (
              <a 
                href={shareUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn btn-primary"
                style={{ width: '100%' }}
              >
                Subir fotos
              </a>
            ) : (
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
                El enlace para subir fotos se configurará próximamente.
              </p>
            )}
          </div>
        </section>
      )}

      {/* SECTION 2: INSTAGRAM */}
      {isInstaVisible && (
        <section id="instagram">
          <div style={{ color: 'var(--color-gold)', display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
            <Instagram size={32} strokeWidth={1.5} />
          </div>

          <h2 className="section-title">Seguinos en Instagram</h2>
          <p className="section-subtitle">Compartí el día a día</p>

          <div className="animate-fade-in-up" style={{ maxWidth: '340px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span className="instagram-user">@{instaUser}</span>
            {instaHashtag && <span className="instagram-hashtag">{instaHashtag}</span>}
            
            <p style={{ fontSize: '0.95rem', color: 'var(--color-text-muted)', marginBottom: '2rem', lineHeight: '1.6', textAlign: 'center' }}>
              {instaText}
            </p>

            {instaUrl ? (
              <a 
                href={instaUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn btn-secondary"
                style={{ width: '100%' }}
              >
                Ver Instagram
              </a>
            ) : (
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
                El enlace de Instagram se configurará próximamente.
              </p>
            )}
          </div>
        </section>
      )}
    </>
  );
}

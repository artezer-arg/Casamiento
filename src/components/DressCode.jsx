import React from 'react';
import { Shirt, Heart, AlertCircle } from 'lucide-react';

export default function DressCode({ config }) {
  const evento = config?.evento || {};
  
  const dressCodeTipo = evento.dress_code_tipo || 'Elegante';
  const dressCodeTexto = evento.dress_code_texto || 'Queremos que te sientas cómodo y elegante para compartir esta noche con nosotros.';
  const dressCodeColores = evento.dress_code_colores || 'Por favor, reservar los colores blanco y bordo para los protagonistas y la ambientación.';
  const dressCodeNota = evento.dress_code_nota || 'No es necesario utilizar los colores de la invitación. Solo te pedimos evitar blanco y bordo.';

  return (
    <section id="dress-code" style={{ padding: '2rem 1.5rem', textAlign: 'center' }}>
      
      {/* Hanger icon */}
      <div style={{ color: 'var(--color-gold)', display: 'flex', justifyContent: 'center', marginBottom: '0.5rem' }}>
        <Shirt size={28} strokeWidth={1.5} />
      </div>

      <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.65rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--color-text-muted)', fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}>Dress Code</span>
      <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: 'var(--color-text-dark)', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0.35rem 0' }}>Código de Vestimenta</h3>
      
      <div style={{ margin: '1.5rem 0' }}>
        <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', fontWeight: 300, color: 'var(--color-olive-dark)', display: 'block', marginBottom: '0.75rem' }}>{dressCodeTipo}</span>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.85rem', color: 'var(--color-text-muted)', lineHeight: '1.6', maxWidth: '90%', margin: '0 auto 1.5rem auto' }}>
          {dressCodeTexto}
        </p>

        {/* Forbidden colors card */}
        <div 
          style={{ 
            backgroundColor: '#faf8f5', 
            border: '1px solid rgba(197, 160, 89, 0.2)', 
            borderRadius: '8px', 
            padding: '1.5rem 1rem',
            margin: '0 auto',
            maxWidth: '90%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <span style={{ fontFamily: 'var(--font-serif)', fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--color-gold)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '0.5rem' }}>Colores Reservados</span>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '1.25rem', lineHeight: '1.5' }}>
            {dressCodeColores}
          </p>

          <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#ffffff', border: '1px solid #dcd6cd', boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.05)' }}></div>
              <span style={{ fontSize: '0.7rem', fontFamily: 'var(--font-sans)', color: 'var(--color-text-muted)' }}>Blanco</span>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#701c24', boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)' }}></div>
              <span style={{ fontSize: '0.7rem', fontFamily: 'var(--font-sans)', color: 'var(--color-text-muted)' }}>Bordo</span>
            </div>
          </div>

          <p style={{ fontSize: '0.75rem', fontFamily: 'var(--font-sans)', color: 'var(--color-text-muted)', fontStyle: 'italic', lineHeight: '1.4' }}>
            {dressCodeNota}
          </p>
        </div>
      </div>

      {/* Separator */}
      <div className="design-separator">
        <Heart size={10} className="design-separator-heart" fill="currentColor" strokeWidth={0} />
      </div>

      {/* 4. Adults only card (inspired by reference image bottom half) */}
      <div style={{ margin: '2rem auto 1rem auto', maxWidth: '85%' }}>
        <div style={{ color: 'var(--color-gold)', display: 'flex', justifyContent: 'center', marginBottom: '0.75rem' }}>
          <AlertCircle size={24} strokeWidth={1.5} />
        </div>
        <span style={{ 
          fontFamily: 'var(--font-sans)', 
          fontSize: '0.65rem', 
          letterSpacing: '0.25em', 
          textTransform: 'uppercase', 
          color: 'var(--color-text-muted)', 
          fontWeight: 600,
          display: 'block',
          marginBottom: '0.5rem'
        }}>
          Sólo Adultos, Por Favor
        </span>
        <p style={{ 
          fontFamily: 'var(--font-serif)', 
          fontSize: '0.82rem', 
          color: 'var(--color-text-muted)', 
          lineHeight: '1.5',
          fontStyle: 'italic',
          marginBottom: '1.25rem'
        }}>
          Esperamos que comprendan que nuestro día especial es una celebración exclusiva para adultos. Queremos que disfruten la noche al máximo.
        </p>

        {/* Detailed eucalyptus leaf and flower branch ornament */}
        <div style={{ display: 'flex', justifyContent: 'center', opacity: 0.85 }}>
          <svg width="120" height="30" viewBox="0 0 100 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10,12 C35,16 65,16 90,12" stroke="#4a5d3b" strokeWidth="0.8" strokeLinecap="round" />
            <path d="M22,13 C18,10 16,13 18,16 C20,19 24,16 22,13 Z" fill="#839b7a" fillOpacity="0.35" stroke="#4a5d3b" strokeWidth="0.4" />
            <path d="M30,13 C34,10 36,13 34,16 C32,19 28,16 30,13 Z" fill="#839b7a" fillOpacity="0.35" stroke="#4a5d3b" strokeWidth="0.4" />
            <path d="M42,14 C38,11 36,14 38,17 C40,20 44,17 42,14 Z" fill="#839b7a" fillOpacity="0.3" stroke="#4a5d3b" strokeWidth="0.4" />
            <path d="M50,14 C54,11 56,13 54,16 C52,19 48,16 50,14 Z" fill="#839b7a" fillOpacity="0.3" stroke="#4a5d3b" strokeWidth="0.4" />
            <path d="M62,13 C58,10 56,13 58,16 C60,19 64,16 62,13 Z" fill="#839b7a" fillOpacity="0.35" stroke="#4a5d3b" strokeWidth="0.4" />
            <path d="M70,13 C74,10 76,13 74,16 C72,19 68,16 70,13 Z" fill="#839b7a" fillOpacity="0.35" stroke="#4a5d3b" strokeWidth="0.4" />
            
            <g transform="translate(36, 11)">
              <circle cx="0" cy="0" r="1.2" fill="var(--color-gold)" />
              <circle cx="-1.5" cy="0" r="0.9" fill="#ffffff" stroke="var(--color-gold)" strokeWidth="0.25" />
              <circle cx="1.5" cy="0" r="0.9" fill="#ffffff" stroke="var(--color-gold)" strokeWidth="0.25" />
              <circle cx="0" cy="-1.5" r="0.9" fill="#ffffff" stroke="var(--color-gold)" strokeWidth="0.25" />
              <circle cx="0" cy="1.5" r="0.9" fill="#ffffff" stroke="var(--color-gold)" strokeWidth="0.25" />
            </g>
            <g transform="translate(56, 12)">
              <circle cx="0" cy="0" r="1.2" fill="var(--color-gold)" />
              <circle cx="-1.5" cy="0" r="0.9" fill="#ffffff" stroke="var(--color-gold)" strokeWidth="0.25" />
              <circle cx="1.5" cy="0" r="0.9" fill="#ffffff" stroke="var(--color-gold)" strokeWidth="0.25" />
              <circle cx="0" cy="-1.5" r="0.9" fill="#ffffff" stroke="var(--color-gold)" strokeWidth="0.25" />
              <circle cx="0" cy="1.5" r="0.9" fill="#ffffff" stroke="var(--color-gold)" strokeWidth="0.25" />
            </g>
            <g transform="translate(76, 11)">
              <circle cx="0" cy="0" r="1.2" fill="var(--color-gold)" />
              <circle cx="-1.5" cy="0" r="0.9" fill="#ffffff" stroke="var(--color-gold)" strokeWidth="0.25" />
              <circle cx="1.5" cy="0" r="0.9" fill="#ffffff" stroke="var(--color-gold)" strokeWidth="0.25" />
              <circle cx="0" cy="-1.5" r="0.9" fill="#ffffff" stroke="var(--color-gold)" strokeWidth="0.25" />
              <circle cx="0" cy="1.5" r="0.9" fill="#ffffff" stroke="var(--color-gold)" strokeWidth="0.25" />
            </g>
          </svg>
        </div>
      </div>

    </section>
  );
}

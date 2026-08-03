import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import EucalyptusCorner from './EucalyptusCorner';



// SVG paper torn edges for images
const TornEdgeTop = () => (
  <svg viewBox="0 0 100 8" preserveAspectRatio="none" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '16px', zIndex: 3, transform: 'scaleY(-1)' }}>
    <path d="M0,0 Q2,2 5,1 T10,2 Q13,0 16,3 T22,1 Q25,3 29,1 T35,2 Q38,0 42,3 T48,1 Q52,3 56,1 T62,2 Q65,0 69,3 T75,1 Q79,3 83,1 T89,2 Q92,0 96,3 T100,0 L100,8 L0,8 Z" fill="#f6f3eb" />
  </svg>
);

const TornEdgeBottom = () => (
  <svg viewBox="0 0 100 8" preserveAspectRatio="none" style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '16px', zIndex: 3 }}>
    <path d="M0,0 Q2,2 5,1 T10,2 Q13,0 16,3 T22,1 Q25,3 29,1 T35,2 Q38,0 42,3 T48,1 Q52,3 56,1 T62,2 Q65,0 69,3 T75,1 Q79,3 83,1 T89,2 Q92,0 96,3 T100,0 L100,8 L0,8 Z" fill="#f6f3eb" />
  </svg>
);

export default function Cover({ config, photos }) {
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

  // Countdown timer logic
  const fecha = config?.evento?.fecha || '2026-10-24';
  const horario = config?.evento?.horario || '17:45';
  const timezoneOffset = '-03:00';

  const getTargetDate = () => {
    const cleanHorario = horario.length === 5 ? `${horario}:00` : horario;
    return new Date(`${fecha}T${cleanHorario}${timezoneOffset}`);
  };

  const calculateTimeLeft = () => {
    const target = getTargetDate();
    const now = new Date();
    const difference = target.getTime() - now.getTime();
    if (difference <= 0) return null;
    return {
      dias: Math.floor(difference / (1000 * 60 * 60 * 24)),
      horas: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutos: Math.floor((difference / 1000 / 60) % 60),
      segundos: Math.floor((difference / 1000) % 60),
    };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, [fecha, horario]);

  return (
    <div style={{ position: 'relative', width: '100%', padding: '3.5rem 1.5rem 2.5rem 1.5rem', textAlign: 'center', zIndex: 1 }}>
      
      {/* Decorative leaf branch corner framing */}
      <EucalyptusCorner className="watercolor-branch-top-right" />
      <EucalyptusCorner className="watercolor-branch-bottom-left" />

      {/* Intro Quote */}
      <p style={{
        fontFamily: 'var(--font-serif)',
        fontSize: '0.85rem',
        lineHeight: '1.5',
        color: 'var(--color-text-muted)',
        fontStyle: 'italic',
        maxWidth: '80%',
        margin: '0 auto 2.5rem auto'
      }}>
        "Tres cosas durarán para siempre: la fe, la esperanza y el amor; y la mayor de las tres es el amor."
        <span style={{ display: 'block', fontSize: '0.7rem', marginTop: '0.4rem', letterSpacing: '0.1em' }}>1 CORINTIOS 13:13</span>
      </p>

      {/* Top Monogram */}
      <div style={{ color: 'var(--color-gold)', display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '0.5rem' }}>
        <span style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', letterSpacing: '0.05em', color: 'var(--color-text-dark)', fontWeight: 300 }}>N | P</span>
        <span style={{ fontSize: '0.65rem', letterSpacing: '0.25em', color: 'var(--color-text-muted)', fontWeight: 600, textTransform: 'uppercase', marginTop: '0.25rem' }}>Nuestro Casamiento</span>
        <Heart size={8} fill="currentColor" strokeWidth={0} style={{ marginTop: '0.5rem', opacity: 0.6 }} />
      </div>

      {/* Main Cover Photo with Torn Edges */}
      <div className="torn-image-container" style={{ height: '300px', margin: '2.5rem 0', boxShadow: '0 8px 25px rgba(42, 51, 36, 0.08)' }}>
        <TornEdgeTop />
        <img 
          src={coverUrl} 
          alt="Nestor y Pame" 
          className="torn-image" 
          style={{ objectPosition: alignment }}
        />
        <TornEdgeBottom />
      </div>

      {/* Invitation intro text */}
      <p style={{
        fontFamily: 'var(--font-serif)',
        fontSize: '0.88rem',
        color: 'var(--color-text-dark)',
        lineHeight: '1.6',
        margin: '0 auto 2rem auto',
        maxWidth: '90%'
      }}>
        Con gran alegría y corazones agradecidos, junto a nuestros padres, los invitamos a compartir la celebración de nuestro amor mientras nos unimos en matrimonio.
      </p>

      {/* Parents Columns */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', margin: '0.5rem 0 2.5rem 0', borderTop: '1px dotted rgba(197, 160, 89, 0.4)', borderBottom: '1px dotted rgba(197, 160, 89, 0.4)', padding: '1rem 0' }}>
        <div style={{ textAlign: 'center', borderRight: '1px solid rgba(197, 160, 89, 0.2)' }}>
          <span style={{ fontFamily: 'var(--font-serif)', fontSize: '0.7rem', letterSpacing: '0.1em', fontWeight: 'bold', color: 'var(--color-gold)', textTransform: 'uppercase', display: 'block', marginBottom: '0.35rem' }}>Padres del Novio</span>
          <span style={{ fontFamily: 'var(--font-serif)', fontSize: '0.8rem', color: 'var(--color-text-dark)' }}>Familia de Nestor</span>
        </div>
        <div style={{ textAlign: 'center' }}>
          <span style={{ fontFamily: 'var(--font-serif)', fontSize: '0.7rem', letterSpacing: '0.1em', fontWeight: 'bold', color: 'var(--color-gold)', textTransform: 'uppercase', display: 'block', marginBottom: '0.35rem' }}>Padres de la Novia</span>
          <span style={{ fontFamily: 'var(--font-serif)', fontSize: '0.8rem', color: 'var(--color-text-dark)' }}>Familia de Pame</span>
        </div>
      </div>

      {/* Stacked script Names (Rafaela & Josue styling) */}
      <div className="names-cursive-container">
        <h1 className="names-cursive-title">Nestor</h1>
        <span className="names-cursive-ampersand">&</span>
        <h1 className="names-cursive-title">Pame</h1>
      </div>

      <p style={{
        fontFamily: 'var(--font-sans)',
        fontSize: '0.65rem',
        letterSpacing: '0.25em',
        color: 'var(--color-text-muted)',
        fontWeight: 600,
        textTransform: 'uppercase',
        margin: '1.5rem 0 2.5rem 0'
      }}>
        Tenemos el honor de invitarlos a nuestra boda
      </p>

      {/* Classic Date grid */}
      <div className="date-columns" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', alignItems: 'center', maxWidth: '300px', margin: '0 auto 0.5rem auto' }}>
        <span style={{ fontFamily: 'var(--font-serif)', fontSize: '0.9rem', textTransform: 'uppercase', color: 'var(--color-text-dark)', letterSpacing: '0.1em', borderRight: '1px solid var(--color-gold)', paddingRight: '0.5rem', textAlign: 'right' }}>Sábado</span>
        <span style={{ fontFamily: 'var(--font-serif)', fontSize: '2.8rem', fontWeight: 300, color: 'var(--color-olive-dark)', lineHeight: '1', padding: '0 0.5rem', textAlign: 'center' }}>24</span>
        <span style={{ fontFamily: 'var(--font-serif)', fontSize: '0.9rem', textTransform: 'uppercase', color: 'var(--color-text-dark)', letterSpacing: '0.1em', borderLeft: '1px solid var(--color-gold)', paddingLeft: '0.5rem', textAlign: 'left' }}>Octubre</span>
      </div>

      <span style={{ 
        fontFamily: 'var(--font-sans)',
        fontSize: '0.65rem', 
        letterSpacing: '0.25em', 
        textTransform: 'uppercase', 
        color: 'var(--color-text-muted)',
        fontWeight: 600,
        display: 'block',
        marginBottom: '2rem'
      }}>
        DOS MIL VEINTISÉIS
      </span>

      {/* Cover Countdown */}
      {timeLeft ? (
        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '45px', padding: '0.4rem 0.5rem', border: '1px solid rgba(197, 160, 89, 0.2)', borderRadius: '4px', backgroundColor: '#faf7f1' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: 'bold', color: 'var(--color-olive)', fontFamily: 'monospace' }}>{String(timeLeft.dias).padStart(2, '0')}</span>
            <span style={{ fontSize: '0.55rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', marginTop: '1px' }}>Días</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '45px', padding: '0.4rem 0.5rem', border: '1px solid rgba(197, 160, 89, 0.2)', borderRadius: '4px', backgroundColor: '#faf7f1' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: 'bold', color: 'var(--color-olive)', fontFamily: 'monospace' }}>{String(timeLeft.horas).padStart(2, '0')}</span>
            <span style={{ fontSize: '0.55rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', marginTop: '1px' }}>Hs</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '45px', padding: '0.4rem 0.5rem', border: '1px solid rgba(197, 160, 89, 0.2)', borderRadius: '4px', backgroundColor: '#faf7f1' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: 'bold', color: 'var(--color-olive)', fontFamily: 'monospace' }}>{String(timeLeft.minutos).padStart(2, '0')}</span>
            <span style={{ fontSize: '0.55rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', marginTop: '1px' }}>Min</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '45px', padding: '0.4rem 0.5rem', border: '1px solid rgba(197, 160, 89, 0.2)', borderRadius: '4px', backgroundColor: '#faf7f1' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: 'bold', color: 'var(--color-olive)', fontFamily: 'monospace' }}>{String(timeLeft.segundos).padStart(2, '0')}</span>
            <span style={{ fontSize: '0.55rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', marginTop: '1px' }}>Seg</span>
          </div>
        </div>
      ) : (
        <div style={{ fontSize: '0.85rem', color: 'var(--color-gold)', fontWeight: 600, marginBottom: '2.5rem', letterSpacing: '0.15em' }}>
          ¡LLEGÓ NUESTRO GRAN DÍA! 💍
        </div>
      )}

      {/* Detailed eucalyptus leaf and flower branch ornament */}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1.5rem', marginBottom: '2rem' }}>
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

      <span style={{
        fontFamily: 'var(--font-serif)',
        fontSize: '0.75rem',
        letterSpacing: '0.15em',
        textTransform: 'uppercase',
        color: 'var(--color-gold)',
        display: 'block'
      }}>
        {getLocationText()}
      </span>
    </div>
  );
}

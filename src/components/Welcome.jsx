import React from 'react';
import { Mail } from 'lucide-react';

export default function Welcome({ onEnter, nombres = 'Nestor & Pame' }) {
  return (
    <div className="welcome-screen" style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Decorative leaf branch corner framing for welcome screen */}
      <div className="watercolor-branch-top-right" />
      <div className="watercolor-branch-bottom-left" />

      <div className="welcome-box animate-fade-in-up" style={{ zIndex: 11 }}>
        {/* Elegant Botanical Ornament */}
        <div className="botanical-header" style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.25rem' }}>
          <svg width="100" height="24" viewBox="0 0 100 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ opacity: 0.85 }}>
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

        <p className="welcome-title">Bienvenidos a nuestra invitación</p>
        <h2 className="welcome-names">{nombres}</h2>

        <div className="welcome-buttons" style={{ display: 'flex', justifyContent: 'center' }}>
          <button 
            className="btn btn-primary" 
            onClick={() => onEnter(true)}
            style={{ width: '100%', maxWidth: '240px', display: 'flex', gap: '0.5rem', justifyContent: 'center', alignItems: 'center' }}
          >
            <Mail size={18} />
            Abrir Invitación
          </button>
        </div>
      </div>
    </div>
  );
}

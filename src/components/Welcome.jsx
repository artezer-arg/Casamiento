import React from 'react';
import { Mail } from 'lucide-react';

export default function Welcome({ onEnter, nombres = 'Nestor & Pame' }) {
  return (
    <div className="welcome-screen">
      <div className="welcome-box animate-fade-in-up">
        {/* Elegant Botanical Ornament */}
        <div className="botanical-header">
          <svg className="botanical-leaf animate-float" viewBox="0 0 100 40" fill="none" style={{ width: '120px', height: 'auto', color: 'var(--color-gold)' }}>
            <path d="M10,20 C35,24 65,24 90,20" stroke="#4a5d3b" strokeWidth="1" strokeLinecap="round" />
            <path d="M22,21 C18,17 16,20 18,24 C20,28 24,25 22,21 Z" fill="#839b7a" fillOpacity="0.35" stroke="#4a5d3b" strokeWidth="0.5" />
            <path d="M30,21 C34,17 36,20 34,24 C32,28 28,25 30,21 Z" fill="#839b7a" fillOpacity="0.35" stroke="#4a5d3b" strokeWidth="0.5" />
            <path d="M42,22 C38,18 36,21 38,25 C40,29 44,26 42,22 Z" fill="#839b7a" fillOpacity="0.3" stroke="#4a5d3b" strokeWidth="0.5" />
            <path d="M50,22 C54,18 56,20 54,24 C52,28 48,25 50,22 Z" fill="#839b7a" fillOpacity="0.3" stroke="#4a5d3b" strokeWidth="0.5" />
            <path d="M62,21 C58,17 56,20 58,24 C60,28 64,25 62,21 Z" fill="#839b7a" fillOpacity="0.35" stroke="#4a5d3b" strokeWidth="0.5" />
            <path d="M70,21 C74,17 76,20 74,24 C72,28 68,25 70,21 Z" fill="#839b7a" fillOpacity="0.35" stroke="#4a5d3b" strokeWidth="0.5" />

            <g transform="translate(50, 16)">
              <circle cx="0" cy="0" r="1.5" fill="var(--color-gold)" />
              <circle cx="-2" cy="0" r="1.2" fill="#ffffff" stroke="var(--color-gold)" strokeWidth="0.35" />
              <circle cx="2" cy="0" r="1.2" fill="#ffffff" stroke="var(--color-gold)" strokeWidth="0.35" />
              <circle cx="0" cy="-2" r="1.2" fill="#ffffff" stroke="var(--color-gold)" strokeWidth="0.35" />
              <circle cx="0" cy="2" r="1.2" fill="#ffffff" stroke="var(--color-gold)" strokeWidth="0.35" />
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

import React from 'react';
import { Music, Volume2 } from 'lucide-react';

export default function Welcome({ onEnter, nombres = 'Nestor & Pame' }) {
  return (
    <div className="welcome-screen">
      <div className="welcome-box animate-fade-in-up">
        {/* Elegant Botanical Ornament */}
        <div className="botanical-header">
          <svg className="botanical-leaf animate-float" viewBox="0 0 100 50">
            <path 
              d="M10,25 Q30,10 50,25 T90,25 Q70,40 50,25 T10,25 Z" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="1.5" 
            />
            <path 
              d="M50,12 C55,18 45,28 50,38 M30,18 C33,22 28,26 31,30 M70,18 C67,22 72,26 69,30" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="1" 
            />
          </svg>
        </div>

        <p className="welcome-title">Bienvenidos a nuestra invitación</p>
        <h2 className="welcome-names">{nombres}</h2>

        <div className="welcome-buttons">
          <button className="btn btn-primary" onClick={() => onEnter(true)}>
            <Volume2 size={18} />
            Ingresar con música
          </button>
          <button className="btn btn-secondary" onClick={() => onEnter(false)}>
            Ingresar sin música
          </button>
        </div>
      </div>
    </div>
  );
}

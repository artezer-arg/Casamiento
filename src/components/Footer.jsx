import React from 'react';

export default function Footer({ config }) {
  const nombres = config?.general?.nombres_novios || 'Nestor y Pame';
  const displayNames = nombres.replace(' y ', ' & ');
  const displayDate = '24 · 10 · 2026';

  return (
    <footer className="footer-container">
      {/* Decorative leaf icon */}
      <div style={{ color: 'var(--color-gold)', marginBottom: '1.5rem', opacity: 0.8 }} className="animate-float">
        <svg width="48" height="48" viewBox="0 0 100 100" fill="currentColor">
          <path d="M50,10 C40,40 10,50 10,55 C10,60 40,70 50,90 C60,70 90,60 90,55 C90,50 60,40 50,10 Z M50,45 C45,50 35,52 35,55 C35,58 45,60 50,65 C55,60 65,58 65,55 C65,52 55,50 50,45 Z" />
        </svg>
      </div>

      <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', fontStyle: 'italic', color: 'var(--color-text-dark)', marginBottom: '1.5rem', maxWidth: '280px', lineHeight: '1.5' }}>
        "Gracias por ser parte de nuestra historia."
      </p>

      <h3 className="footer-names">{displayNames}</h3>
      <span className="footer-date">{displayDate}</span>

      {/* Small botanical leaf SVG bottom left */}
      <svg className="bg-leaves bg-leaves-bottom-left" viewBox="0 0 100 100" style={{ opacity: 0.08 }}>
        <path d="M10,80 Q50,40 80,10 Q60,40 50,80" fill="none" stroke="currentColor" strokeWidth="2"/>
        <path d="M30,60 Q20,40 10,50 M50,40 Q40,20 30,30 M70,20 Q60,5 50,15" fill="none" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    </footer>
  );
}

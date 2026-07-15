import React, { useState } from 'react';
import { Menu, X, CalendarCheck } from 'lucide-react';

export default function Navbar({ onOpenRSVP, config }) {
  const [isOpen, setIsOpen] = useState(false);

  const menuLinks = [
    { label: 'Inicio', href: '#root' },
    { label: 'Cuenta Regresiva', href: '#cuenta-regresiva' },
    { label: 'Ceremonia y Fiesta', href: '#ceremonia-y-fiesta' },
    { label: 'Dress Code', href: '#dress-code' },
    { label: 'Mesa de Regalos', href: '#regalos' },
    { label: 'Sugerir Canción', href: '#canciones' },
    { label: 'Instagram', href: '#instagram' }
  ];

  const handleLinkClick = (e, href) => {
    e.preventDefault();
    setIsOpen(false);
    
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Floating Menu Trigger (Bottom Left) */}
      <button 
        className="mobile-nav-btn" 
        onClick={() => setIsOpen(true)}
        aria-label="Abrir menú de navegación"
        title="Navegación"
      >
        <Menu size={22} />
      </button>

      {/* Slide-out Drawer Overlay */}
      {isOpen && (
        <div className="nav-menu-drawer" onClick={() => setIsOpen(false)}>
          <div className="nav-menu-content" onClick={(e) => e.stopPropagation()}>
            <div className="nav-menu-header">
              <span className="nav-menu-title">Navegación</span>
              <button 
                className="modal-close-btn" 
                onClick={() => setIsOpen(false)}
                aria-label="Cerrar menú"
              >
                <X size={20} />
              </button>
            </div>
            
            <ul className="nav-links-list">
              {menuLinks.map((link) => {
                // If section is hidden in config, we can optionally hide it in menu.
                // For simplicity and ease, we show all primary sections or verify visibility.
                return (
                  <li key={link.href} className="nav-link-item">
                    <a 
                      href={link.href} 
                      onClick={(e) => handleLinkClick(e, link.href)}
                    >
                      {link.label}
                    </a>
                  </li>
                );
              })}
            </ul>

            <button 
              type="button" 
              className="btn btn-primary" 
              style={{ marginTop: 'auto', gap: '0.5rem' }}
              onClick={() => {
                setIsOpen(false);
                onOpenRSVP();
              }}
            >
              <CalendarCheck size={16} />
              Confirmar ahora
            </button>
          </div>
        </div>
      )}

      {/* Permanent RSVP Action Button (Bottom Right) */}
      <button 
        onClick={onOpenRSVP} 
        className="btn btn-primary floating-rsvp-trigger"
        aria-label="Confirmar asistencia al casamiento"
      >
        Confirmar asistencia
      </button>
    </>
  );
}

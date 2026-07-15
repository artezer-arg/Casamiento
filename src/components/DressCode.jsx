import React from 'react';
import { Shirt } from 'lucide-react';

export default function DressCode({ config }) {
  const evento = config?.evento || {};
  
  const dressCodeTipo = evento.dress_code_tipo || 'Elegante';
  const dressCodeTexto = evento.dress_code_texto || 'Queremos que te sientas cómodo y elegante para compartir esta noche con nosotros.';
  const dressCodeColores = evento.dress_code_colores || 'Por favor, reservar los colores blanco y bordo para los protagonistas y la ambientación.';
  const dressCodeNota = evento.dress_code_nota || 'No es necesario utilizar los colores de la invitación. Solo te pedimos evitar blanco y bordo.';

  return (
    <section id="dress-code">
      {/* Decorative hanger/shirt icon */}
      <div style={{ color: 'var(--color-gold)', display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
        <Shirt size={32} strokeWidth={1.5} />
      </div>

      <h2 className="section-title">Código de Vestimenta</h2>
      <p className="section-subtitle">Dress Code</p>

      <div className="arch-card-wrapper">
        <div className="arch-card animate-fade-in-up">
          <span className="dress-code-value">{dressCodeTipo}</span>
          
          <p className="dress-code-text" style={{ marginBottom: '1.5rem' }}>{dressCodeTexto}</p>
          
          <div 
            style={{ 
              backgroundColor: 'var(--bg-crema-alt)', 
              border: '1px solid var(--color-border)', 
              borderRadius: 'var(--radius-md)', 
              padding: '1.5rem 1rem',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              zIndex: 2
            }}
          >
            <span className="colors-reserved-title">Colores Reservados</span>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-dark)', marginBottom: '1.5rem', lineHeight: '1.5' }}>
              {dressCodeColores}
            </p>

            <div className="forbidden-colors" style={{ marginBottom: '1rem' }}>
              <div className="forbidden-color-wrapper">
                <div className="color-circle white" title="Blanco Reservado"></div>
                <span className="forbidden-color-label">Blanco</span>
              </div>
              
              <div className="forbidden-color-wrapper">
                <div className="color-circle bordo" title="Bordo Reservado"></div>
                <span className="forbidden-color-label">Bordo</span>
              </div>
            </div>

            <p className="dress-code-note" style={{ fontSize: '0.75rem' }}>{dressCodeNota}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

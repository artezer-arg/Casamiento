import React, { useState } from 'react';
import { Gift, Copy, Check, Mail, Heart } from 'lucide-react';

export default function Gifts({ config }) {
  const [copied, setCopied] = useState(false);

  const regalos = config?.regalos || {};
  const isVisible = regalos.visible ?? true;
  const alias = regalos.alias || 'casamiento.nestor.pame';
  const titular = regalos.titular || 'Nestor y Pame';
  const banco = regalos.banco || 'Banco Galicia';
  const cbu = regalos.cbu_cvu || '0070000000000000000000';
  const textoRegalos = regalos.texto_regalos || 'El mejor regalo es compartir este momento con nosotros. Pero si además querés ayudarnos a cumplir nuestros próximos sueños, te dejamos nuestros datos.';

  const handleCopyAlias = () => {
    navigator.clipboard.writeText(alias)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch((err) => {
        console.error('Error copying text to clipboard: ', err);
      });
  };

  if (!isVisible) return null;

  return (
    <section id="regalos" style={{ padding: '2rem 1.5rem', textAlign: 'center' }}>
      
      {/* Gift icon */}
      <div style={{ color: 'var(--color-gold)', display: 'flex', justifyContent: 'center', marginBottom: '0.5rem' }}>
        <Gift size={28} strokeWidth={1.5} />
      </div>

      <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.65rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--color-text-muted)', fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}>Regalos</span>
      <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: 'var(--color-text-dark)', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0.35rem 0' }}>Sugerencia de Regalo</h3>

      <div style={{ margin: '1.5rem auto', maxWidth: '90%' }}>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '1.5rem', lineHeight: '1.6' }}>
          {textoRegalos}
        </p>

        {/* Banking box matching style */}
        <div 
          style={{ 
            backgroundColor: '#faf8f5', 
            border: '1px solid rgba(197, 160, 89, 0.2)', 
            borderRadius: '8px', 
            padding: '1.5rem 1rem',
            marginBottom: '1.5rem',
            textAlign: 'left'
          }}
        >
          {banco && (
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(197, 160, 89, 0.1)', paddingBottom: '0.5rem', marginBottom: '0.5rem' }}>
              <span style={{ fontFamily: 'var(--font-serif)', fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--color-gold)', textTransform: 'uppercase' }}>Banco</span>
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.8rem', color: 'var(--color-text-dark)' }}>{banco}</span>
            </div>
          )}
          {titular && (
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(197, 160, 89, 0.1)', paddingBottom: '0.5rem', marginBottom: '0.5rem' }}>
              <span style={{ fontFamily: 'var(--font-serif)', fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--color-gold)', textTransform: 'uppercase' }}>Titular</span>
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.8rem', color: 'var(--color-text-dark)' }}>{titular}</span>
            </div>
          )}
          {cbu && (
            <div style={{ display: 'flex', flexDirection: 'column', borderBottom: '1px solid rgba(197, 160, 89, 0.1)', paddingBottom: '0.5rem', marginBottom: '0.5rem', gap: '0.15rem' }}>
              <span style={{ fontFamily: 'var(--font-serif)', fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--color-gold)', textTransform: 'uppercase' }}>CBU / CVU</span>
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.75rem', color: 'var(--color-text-dark)', wordBreak: 'break-all' }}>{cbu}</span>
            </div>
          )}
          
          <div style={{ marginTop: '0.75rem', padding: '0.5rem', backgroundColor: 'var(--bg-crema-alt)', borderRadius: '4px', textAlign: 'center' }}>
            <span style={{ fontSize: '0.6rem', fontFamily: 'var(--font-sans)', textTransform: 'uppercase', color: 'var(--color-text-muted)', display: 'block', fontWeight: 600, letterSpacing: '0.05em', marginBottom: '0.15rem' }}>Alias</span>
            <span style={{ fontFamily: 'var(--font-serif)', fontSize: '0.95rem', fontWeight: 'bold', color: 'var(--color-olive-dark)' }}>{alias}</span>
          </div>
        </div>

        <button 
          onClick={handleCopyAlias} 
          className="design-btn-dark"
          style={{ width: '100%', justifyContent: 'center' }}
        >
          {copied ? (
            <>
              <Check size={14} />
              ¡Alias Copiado!
            </>
          ) : (
            <>
              <Copy size={14} />
              Copiar Alias
            </>
          )}
        </button>
      </div>

      {/* Gift Envelope notice below as reference image */}
      <div style={{ marginTop: '2rem' }}>
        <div style={{ color: 'var(--color-gold)', display: 'flex', justifyContent: 'center', marginBottom: '0.5rem' }}>
          <Mail size={22} strokeWidth={1.5} />
        </div>
        <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.65rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--color-text-muted)', fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}>Lluvia de Sobres</span>
        <p style={{ fontFamily: 'var(--font-serif)', fontSize: '0.8rem', color: 'var(--color-text-muted)', fontStyle: 'italic', maxWidth: '80%', margin: '0 auto' }}>
          Si lo preferís, también dispondremos de un cofre en el salón para dejar sobres de regalo.
        </p>
      </div>

      {/* Separator */}
      <div className="design-separator">
        <Heart size={10} className="design-separator-heart" fill="currentColor" strokeWidth={0} />
      </div>

      {copied && (
        <div className="toast-feedback">
          Alias copiado al portapapeles
        </div>
      )}
    </section>
  );
}

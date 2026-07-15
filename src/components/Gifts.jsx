import React, { useState } from 'react';
import { Gift, Copy, Check } from 'lucide-react';

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
    <section id="regalos">
      {/* Decorative leaf icon */}
      <div style={{ color: 'var(--color-gold)', display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
        <Gift size={32} strokeWidth={1.5} />
      </div>

      <h2 className="section-title">Regalos</h2>
      <p className="section-subtitle">Agradecemos tu gesto</p>

      <div className="arch-card-wrapper">
        <div className="arch-card animate-fade-in-up">
          <p style={{ fontSize: '0.95rem', color: 'var(--color-text-muted)', marginBottom: '1.5rem', lineHeight: '1.6' }}>
            {textoRegalos}
          </p>

          <div className="bank-info-box" style={{ width: '100%', marginBottom: '1rem' }}>
            {banco && (
              <div className="bank-info-row">
                <span className="bank-info-label">Banco</span>
                <span className="bank-info-val">{banco}</span>
              </div>
            )}
            {titular && (
              <div className="bank-info-row">
                <span className="bank-info-label">Titular</span>
                <span className="bank-info-val">{titular}</span>
              </div>
            )}
            {cbu && (
              <div className="bank-info-row">
                <span className="bank-info-label">CBU/CVU</span>
                <span className="bank-info-val" style={{ fontSize: '0.8rem', wordBreak: 'break-all' }}>{cbu}</span>
              </div>
            )}
            
            <div className="alias-box">
              <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-text-muted)', display: 'block', fontWeight: 400 }}>Alias</span>
              {alias}
            </div>
          </div>

          <button 
            onClick={handleCopyAlias} 
            className={`btn ${copied ? 'btn-primary' : 'btn-gold'}`} 
            style={{ width: '100%', marginTop: '0.5rem' }}
          >
            {copied ? (
              <>
                <Check size={18} />
                ¡Alias copiado!
              </>
            ) : (
              <>
                <Copy size={18} />
                Copiar alias
              </>
            )}
          </button>
        </div>
      </div>

      {copied && (
        <div className="toast-feedback">
          Alias copiado al portapapeles
        </div>
      )}
    </section>
  );
}

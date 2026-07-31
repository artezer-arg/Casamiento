import React, { useState, useEffect } from 'react';
import { Heart, MessageSquare, Loader, Check, AlertCircle } from 'lucide-react';
import { dbClient } from '../db/dbClient';

export default function Guestbook() {
  const [messages, setMessages] = useState([]);
  const [autor, setAutor] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Load messages on mount
  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const data = await dbClient.messages.list();
      setMessages(data || []);
    } catch (err) {
      console.error('Failed to load guestbook messages:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!autor.trim() || !mensaje.trim()) {
      setError('Por favor completá tu firma y tu mensaje.');
      return;
    }

    setSubmitting(true);
    setError('');
    setSuccess(false);

    try {
      const newMsg = await dbClient.messages.add({
        autor: autor.trim(),
        mensaje: mensaje.trim()
      });
      
      // Update local state by prepending the message
      setMessages(prev => [newMsg, ...prev]);
      setAutor('');
      setMensaje('');
      setSuccess(true);
      
      // Clear success alert after 4 seconds
      setTimeout(() => setSuccess(false), 4000);
    } catch (err) {
      setError('Ocurrió un error al enviar tu mensaje. Intentá de nuevo.');
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('es-AR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch (e) {
      return '';
    }
  };

  return (
    <section id="libro-firmas" className="details-container" style={{ backgroundColor: 'var(--bg-crema)', padding: '5rem 1.5rem' }}>
      
      {/* Decorative Wreath */}
      <div style={{ color: 'var(--color-gold)', display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
        <Heart size={32} fill="currentColor" strokeWidth={1} style={{ opacity: 0.8 }} />
      </div>

      <h2 className="section-title">Libro de Firmas</h2>
      <p className="section-subtitle" style={{ marginBottom: '3rem' }}>
        Dejanos tus buenos deseos y dedicatorias
      </p>

      <div className="details-grid" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2.5rem', maxWidth: '900px', margin: '0 auto' }}>
        
        {/* Write message Card */}
        <div className="details-card" style={{ padding: '2.5rem 2rem', border: '1px solid rgba(197, 160, 89, 0.3)', borderRadius: '12px', background: 'var(--bg-crema-alt)' }}>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: 'var(--color-olive)', marginBottom: '1.5rem', textAlign: 'center' }}>
            Escribir dedicatoria
          </h3>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {error && (
              <div className="admin-login-error" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', backgroundColor: '#f8d7da', color: '#842029', padding: '0.75rem', borderRadius: '4px', fontSize: '0.85rem' }}>
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', backgroundColor: '#d1e7dd', color: '#0f5132', padding: '0.75rem', borderRadius: '4px', fontSize: '0.85rem' }}>
                <Check size={16} />
                <span>¡Dedicatoria guardada! Gracias por tus palabras.</span>
              </div>
            )}

            <div className="form-group" style={{ textAlign: 'left' }}>
              <label className="form-label required" htmlFor="msg-autor" style={{ fontSize: '0.85rem', fontWeight: 600 }}>Nombre o Familia</label>
              <input 
                type="text" 
                id="msg-autor" 
                className="form-input" 
                value={autor} 
                onChange={(e) => setAutor(e.target.value)} 
                placeholder="Ej: Familia González o Sofi y Gonza"
                maxLength={80}
                style={{ backgroundColor: 'var(--color-white)' }}
              />
            </div>

            <div className="form-group" style={{ textAlign: 'left' }}>
              <label className="form-label required" htmlFor="msg-text" style={{ fontSize: '0.85rem', fontWeight: 600 }}>Mensaje para los novios</label>
              <textarea 
                id="msg-text" 
                className="form-input" 
                value={mensaje} 
                onChange={(e) => setMensaje(e.target.value)} 
                placeholder="Escribí tus deseos acá..."
                maxLength={800}
                style={{ minHeight: '120px', resize: 'vertical', backgroundColor: 'var(--color-white)' }}
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={submitting}
              style={{ width: '100%', padding: '1rem', display: 'flex', gap: '0.5rem', justifyContent: 'center', alignItems: 'center' }}
            >
              {submitting ? (
                <>
                  <Loader size={18} className="animate-spin-slow" />
                  Guardando...
                </>
              ) : (
                <>
                  <MessageSquare size={18} />
                  Enviar dedicatoria
                </>
              )}
            </button>
          </form>
        </div>

        {/* Read messages List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: 'var(--color-olive)', marginBottom: '0.5rem', textAlign: 'center' }}>
            Mensajes de los invitados
          </h3>

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
              <Loader className="animate-spin-slow" size={24} style={{ color: 'var(--color-gold)' }} />
            </div>
          ) : messages.length === 0 ? (
            <p style={{ textAlign: 'center', fontStyle: 'italic', color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
              Todavía no hay mensajes cargados. ¡Sé el primero en dejar tu firma!
            </p>
          ) : (
            <div 
              className="messages-scroller" 
              style={{ 
                maxHeight: '480px', 
                overflowY: 'auto', 
                paddingRight: '0.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.25rem'
              }}
            >
              {messages.map((m) => (
                <div 
                  key={m.id} 
                  className="message-item animate-fade-in-up"
                  style={{ 
                    backgroundColor: 'var(--color-white)', 
                    padding: '1.5rem', 
                    borderRadius: '8px', 
                    border: '1px solid rgba(197, 160, 89, 0.2)',
                    boxShadow: '0 4px 15px rgba(42, 51, 36, 0.03)',
                    textAlign: 'left',
                    position: 'relative'
                  }}
                >
                  {/* Small gold heart inside the card */}
                  <span style={{ position: 'absolute', right: '1.5rem', top: '1.5rem', color: 'var(--color-gold)', opacity: 0.35 }}>
                    <Heart size={14} fill="currentColor" />
                  </span>

                  <p style={{ fontSize: '0.95rem', color: 'var(--color-text-dark)', lineHeight: '1.5', margin: '0 0 1rem 0', whiteSpace: 'pre-wrap', fontStyle: 'italic' }}>
                    "{m.mensaje}"
                  </p>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1ece1', paddingTop: '0.75rem' }}>
                    <span style={{ fontWeight: 600, color: 'var(--color-olive)', fontSize: '0.85rem' }}>
                      — {m.autor}
                    </span>
                    <span style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>
                      {formatDate(m.fecha_creacion)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </section>
  );
}

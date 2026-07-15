import React, { useState } from 'react';
import { Music, X, AlertCircle, Loader, Check } from 'lucide-react';

export default function SongSuggester({ config, onSubmit }) {
  const [isOpen, setIsOpen] = useState(false);
  const [invitado, setInvitado] = useState('');
  const [cancion, setCancion] = useState('');
  const [artista, setArtista] = useState('');
  const [comentario, setComentario] = useState('');

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const enlaces = config?.enlaces || {};
  const isVisible = enlaces.sugerir_canciones_visible ?? true;
  const modalidad = enlaces.sugerir_canciones_modalidad || 'interno'; // 'interno' o 'externo'
  const urlExterna = enlaces.sugerir_canciones_url || '';

  const handleOpenForm = () => {
    if (modalidad === 'externo' && urlExterna) {
      window.open(urlExterna, '_blank', 'noopener,noreferrer');
    } else {
      setInvitado('');
      setCancion('');
      setArtista('');
      setComentario('');
      setErrors({});
      setIsSuccess(false);
      setSubmitError('');
      setIsOpen(true);
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!invitado.trim()) newErrors.invitado = 'Tu nombre es obligatorio.';
    if (!cancion.trim()) newErrors.cancion = 'El nombre de la canción es obligatorio.';
    if (!artista.trim()) newErrors.artista = 'El artista o banda es obligatorio.';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setSubmitError('');

    try {
      await onSubmit({
        invitado: invitado.trim(),
        cancion: cancion.trim(),
        artista: artista.trim(),
        comentario: comentario.trim()
      });
      setIsSuccess(true);
    } catch (err) {
      setSubmitError('Error al guardar tu sugerencia. Intentá de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isVisible) return null;

  return (
    <section id="canciones">
      {/* Decorative leaf icon */}
      <div style={{ color: 'var(--color-gold)', display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
        <Music size={32} strokeWidth={1.5} />
      </div>

      <h2 className="section-title">La Música</h2>
      <p className="section-subtitle">Sugerí tus canciones</p>

      <div className="arch-card-wrapper">
        <div className="arch-card animate-fade-in-up">
          <p style={{ fontSize: '0.95rem', color: 'var(--color-text-muted)', marginBottom: '1.5rem', lineHeight: '1.6' }}>
            Queremos que la pista no pare. Contanos qué canción no puede faltar en nuestra fiesta para bailar toda la noche.
          </p>

          <button onClick={handleOpenForm} className="btn btn-primary" style={{ width: '100%' }}>
            Sugerir una canción
          </button>
        </div>
      </div>

      {/* Internal Form Modal */}
      {isOpen && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h3 className="modal-title">Sugerir Canción</h3>
              <button className="modal-close-btn" onClick={() => setIsOpen(false)} aria-label="Cerrar">
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">
              {isSuccess ? (
                <div className="success-container animate-fade-in-up">
                  <div className="success-icon">
                    <Check size={36} strokeWidth={2.5} />
                  </div>
                  <h4 className="success-title">¡Sugerencia Enviada!</h4>
                  <p className="success-text">
                    ¡Gracias por tu sugerencia! Sumamos tu canción a la lista.
                  </p>
                  <button 
                    type="button" 
                    className="btn btn-primary" 
                    onClick={() => setIsOpen(false)}
                    style={{ marginTop: '1rem' }}
                  >
                    Cerrar
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="animate-fade-in-up">
                  <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '1.5rem', textAlign: 'left' }}>
                    Dejanos los detalles del tema que querés escuchar en la fiesta.
                  </p>

                  {submitError && (
                    <div className="admin-login-error" style={{ marginBottom: '1.25rem' }}>
                      <AlertCircle size={18} />
                      <span>{submitError}</span>
                    </div>
                  )}

                  <div className="form-group">
                    <label className="form-label required" htmlFor="song-invitado">Tu Nombre</label>
                    <input 
                      type="text" 
                      id="song-invitado" 
                      className="form-input" 
                      value={invitado} 
                      onChange={(e) => setInvitado(e.target.value)} 
                      placeholder="Tu nombre y apellido"
                    />
                    {errors.invitado && <span className="error-message"><AlertCircle size={12} /> {errors.invitado}</span>}
                  </div>

                  <div className="form-group">
                    <label className="form-label required" htmlFor="song-titulo">Canción</label>
                    <input 
                      type="text" 
                      id="song-titulo" 
                      className="form-input" 
                      value={cancion} 
                      onChange={(e) => setCancion(e.target.value)} 
                      placeholder="Nombre del tema"
                    />
                    {errors.cancion && <span className="error-message"><AlertCircle size={12} /> {errors.cancion}</span>}
                  </div>

                  <div className="form-group">
                    <label className="form-label required" htmlFor="song-artista">Artista / Banda</label>
                    <input 
                      type="text" 
                      id="song-artista" 
                      className="form-input" 
                      value={artista} 
                      onChange={(e) => setArtista(e.target.value)} 
                      placeholder="Nombre del artista o grupo"
                    />
                    {errors.artista && <span className="error-message"><AlertCircle size={12} /> {errors.artista}</span>}
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="song-comentario">Comentario (Opcional)</label>
                    <input 
                      type="text" 
                      id="song-comentario" 
                      className="form-input" 
                      value={comentario} 
                      onChange={(e) => setComentario(e.target.value)} 
                      placeholder="Ej: Para bailar después de las 12 (Opcional)"
                    />
                  </div>

                  <button 
                    type="submit" 
                    className="btn btn-primary" 
                    style={{ width: '100%', marginTop: '1rem' }}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader size={18} className="animate-spin-slow" />
                        Guardando...
                      </>
                    ) : (
                      'Enviar sugerencia'
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

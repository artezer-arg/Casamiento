import React, { useState, useEffect } from 'react';
import { X, Check, AlertCircle, Loader } from 'lucide-react';

export default function RSVPModal({ isOpen, onClose, onSubmit }) {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [dni, setDni] = useState('');
  const [asiste, setAsiste] = useState(null); // true = sí, false = no
  const [restricciones, setRestricciones] = useState('');
  const [comentarios, setComentarios] = useState('');

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setNombre('');
      setApellido('');
      setDni('');
      setAsiste(null);
      setRestricciones('');
      setComentarios('');
      setErrors({});
      setIsSuccess(false);
      setSubmitError('');
    }
  }, [isOpen]);

  // Confetti effect on success
  useEffect(() => {
    if (isSuccess) {
      const container = document.getElementById('confetti-container');
      if (!container) return;
      
      // Clear previous
      container.innerHTML = '';
      
      const colors = ['#c5a059', '#839b7a', '#d4af37', '#4a5d3b', '#eae3d5'];
      for (let i = 0; i < 50; i++) {
        const piece = document.createElement('div');
        piece.style.position = 'absolute';
        piece.style.width = `${Math.random() * 8 + 6}px`;
        piece.style.height = `${Math.random() * 12 + 6}px`;
        piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        piece.style.left = `${Math.random() * 100}%`;
        piece.style.top = `${Math.random() * -10}px`;
        piece.style.opacity = Math.random();
        piece.style.transform = `rotate(${Math.random() * 360}deg)`;
        
        const fallDuration = Math.random() * 2 + 1.5;
        piece.style.animation = `confetti-fall ${fallDuration}s linear forwards`;
        container.appendChild(piece);
      }
    }
  }, [isSuccess]);

  if (!isOpen) return null;

  const handleDniChange = (e) => {
    const val = e.target.value.replace(/\D/g, ''); // Numbers only
    setDni(val);
  };

  const validate = () => {
    const newErrors = {};
    if (!nombre.trim()) newErrors.nombre = 'El nombre es obligatorio.';
    if (!apellido.trim()) newErrors.apellido = 'El apellido es obligatorio.';
    if (!dni.trim()) {
      newErrors.dni = 'El DNI es obligatorio.';
    } else if (!/^\d+$/.test(dni)) {
      newErrors.dni = 'El DNI debe contener solo números.';
    }
    if (asiste === null) newErrors.asiste = 'Debe seleccionar una respuesta.';

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
        nombre: nombre.trim(),
        apellido: apellido.trim(),
        dni: dni.trim(),
        asiste,
        restricciones_alimentarias: restricciones.trim() || 'Ninguna',
        comentarios: comentarios.trim() || ''
      });
      setIsSuccess(true);
    } catch (err) {
      setSubmitError(err.message || 'Ocurrió un error al enviar la confirmación. Intentá de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h3 className="modal-title">Confirmar Asistencia</h3>
          <button className="modal-close-btn" onClick={onClose} aria-label="Cerrar">
            <X size={20} />
          </button>
        </div>

        <div className="modal-body" style={{ position: 'relative' }}>
          {isSuccess && <div id="confetti-container" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 1000 }} />}

          {isSuccess ? (
            <div className="success-container animate-fade-in-up">
              <div className="success-icon">
                <Check size={36} strokeWidth={2.5} />
              </div>
              <h4 className="success-title">¡Muchas gracias!</h4>
              <p className="success-text">
                Registramos correctamente tu confirmación. ¡Nos vemos pronto!
              </p>
              <button 
                type="button" 
                className="btn btn-primary" 
                onClick={onClose}
                style={{ marginTop: '1rem' }}
              >
                Cerrar
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="animate-fade-in-up">
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '1.5rem', textAlign: 'left' }}>
                Completá el formulario para ayudarnos con la organización del evento. Los campos con * son obligatorios.
              </p>

              {submitError && (
                <div className="admin-login-error" style={{ marginBottom: '1.25rem' }}>
                  <AlertCircle size={18} />
                  <span>{submitError}</span>
                </div>
              )}

              <div className="form-group">
                <label className="form-label required" htmlFor="rsvp-nombre">Nombre</label>
                <input 
                  type="text" 
                  id="rsvp-nombre" 
                  className="form-input" 
                  value={nombre} 
                  onChange={(e) => setNombre(e.target.value)} 
                  placeholder="Tu nombre"
                />
                {errors.nombre && <span className="error-message"><AlertCircle size={12} /> {errors.nombre}</span>}
              </div>

              <div className="form-group">
                <label className="form-label required" htmlFor="rsvp-apellido">Apellido</label>
                <input 
                  type="text" 
                  id="rsvp-apellido" 
                  className="form-input" 
                  value={apellido} 
                  onChange={(e) => setApellido(e.target.value)} 
                  placeholder="Tu apellido"
                />
                {errors.apellido && <span className="error-message"><AlertCircle size={12} /> {errors.apellido}</span>}
              </div>

              <div className="form-group">
                <label className="form-label required" htmlFor="rsvp-dni">DNI (Solo números)</label>
                <input 
                  type="text" 
                  id="rsvp-dni" 
                  className="form-input" 
                  value={dni} 
                  onChange={handleDniChange} 
                  placeholder="Ej: 12345678"
                  inputMode="numeric"
                />
                {errors.dni && <span className="error-message"><AlertCircle size={12} /> {errors.dni}</span>}
              </div>

              <div className="form-group">
                <label className="form-label required">¿Asistirás al evento?</label>
                <div className="radio-group">
                  <label className={`radio-label ${asiste === true ? 'selected' : ''}`}>
                    <input 
                      type="radio" 
                      name="asiste" 
                      className="radio-input" 
                      checked={asiste === true} 
                      onChange={() => setAsiste(true)} 
                    />
                    Sí, confirmo asistencia
                  </label>
                  <label className={`radio-label ${asiste === false ? 'selected' : ''}`}>
                    <input 
                      type="radio" 
                      name="asiste" 
                      className="radio-input" 
                      checked={asiste === false} 
                      onChange={() => setAsiste(false)} 
                    />
                    No podré asistir
                  </label>
                </div>
                {errors.asiste && <span className="error-message"><AlertCircle size={12} /> {errors.asiste}</span>}
              </div>

              {asiste === true && (
                <div className="form-group">
                  <label className="form-label" htmlFor="rsvp-restricciones">Restricciones Alimentarias</label>
                  <input 
                    type="text" 
                    id="rsvp-restricciones" 
                    className="form-input" 
                    value={restricciones} 
                    onChange={(e) => setRestricciones(e.target.value)} 
                    placeholder="Celíaco, vegetariano, alergias, etc. (Opcional)"
                  />
                </div>
              )}

              <div className="form-group">
                <label className="form-label" htmlFor="rsvp-comentarios">Comentarios</label>
                <textarea 
                  id="rsvp-comentarios" 
                  className="form-input" 
                  value={comentarios} 
                  onChange={(e) => setComentarios(e.target.value)} 
                  placeholder="Algún mensaje para los novios... (Opcional)"
                  style={{ minHeight: '80px', resize: 'vertical' }}
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
                    Enviando...
                  </>
                ) : (
                  'Confirmar asistencia'
                )}
              </button>
            </form>
          )}
        </div>
      </div>

      <style>{`
        @keyframes confetti-fall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(450px) rotate(720deg); opacity: 0; }
        }
        .animate-spin-slow {
          animation: spin 2s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

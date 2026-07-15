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

  // Trivia Game state
  const [triviaState, setTriviaState] = useState('intro'); // 'intro', 'playing', 'finished'
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [answered, setAnswered] = useState(false);

  const TRIVIA_QUESTIONS = [
    {
      question: "¿Dónde se conocieron Nestor y Pame?",
      options: [
        "A) En la facultad estudiando",
        "B) En el trabajo compartiendo oficina",
        "C) En un recital de música"
      ],
      correct: 1,
      explicacion: "¡Se conocieron trabajando juntos! Compartieron oficina y proyectos antes de que naciera el amor."
    },
    {
      question: "¿Quién dio el primer paso?",
      options: [
        "A) Nestor (la invitó a cenar)",
        "B) Pame (lo invitó a tomar café)",
        "C) Fue mutuo y natural"
      ],
      correct: 0,
      explicacion: "¡Nestor tomó la iniciativa! Planificó la invitación a cenar detalladamente por días."
    },
    {
      question: "¿Cuál es el destino soñado que planearon para su luna de miel?",
      options: [
        "A) Las playas del Caribe",
        "B) La costa de Positano, Italia",
        "C) El sur de Argentina"
      ],
      correct: 1,
      explicacion: "¡Eligieron Italia! Sueñan con recorrer la romántica costa amalfitana y la hermosa Positano."
    }
  ];

  const handleSelectOption = (idx) => {
    if (answered) return;
    setSelectedOption(idx);
    setAnswered(true);
    if (idx === TRIVIA_QUESTIONS[currentQuestion].correct) {
      setScore(prev => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    setAnswered(false);
    if (currentQuestion < TRIVIA_QUESTIONS.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      setTriviaState('finished');
    }
  };

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
      // Reset trivia
      setTriviaState('intro');
      setCurrentQuestion(0);
      setScore(0);
      setSelectedOption(null);
      setAnswered(false);
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
            <div className="success-container animate-fade-in-up" style={{ width: '100%' }}>
              {asiste === false ? (
                <div style={{ textAlign: 'center' }}>
                  <div className="success-icon" style={{ margin: '0 auto 1.5rem auto' }}>
                    <Check size={36} strokeWidth={2.5} />
                  </div>
                  <h4 className="success-title">Confirmación Registrada</h4>
                  <p className="success-text" style={{ marginBottom: '1.5rem' }}>
                    Lamentamos que no puedas acompañarnos, ¡te vamos a extrañar! Gracias por avisarnos.
                  </p>
                  <button type="button" className="btn btn-primary" onClick={onClose} style={{ width: '100%' }}>
                    Cerrar
                  </button>
                </div>
              ) : (
                <div style={{ width: '100%' }}>
                  {triviaState === 'intro' && (
                    <div style={{ textAlign: 'center' }}>
                      <div className="success-icon" style={{ margin: '0 auto 1rem auto', fontSize: '1.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        🎉
                      </div>
                      <h4 className="success-title">¡Asistencia Confirmada!</h4>
                      <p className="success-text" style={{ fontSize: '0.85rem', marginBottom: '1.5rem', lineHeight: '1.5' }}>
                        ¡Qué alegría que nos acompañes! Para palpitar la previa, te invitamos a jugar a la **Trivia de Nestor y Pame**. ¡Si respondés bien, podés ganar un premio sorpresa en la fiesta!
                      </p>
                      <button 
                        type="button" 
                        className="btn btn-primary" 
                        onClick={() => setTriviaState('playing')} 
                        style={{ width: '100%' }}
                      >
                        Jugar Trivia 🎮
                      </button>
                      <button 
                        type="button" 
                        className="btn btn-secondary" 
                        onClick={onClose} 
                        style={{ width: '100%', marginTop: '0.75rem' }}
                      >
                        No, gracias (Cerrar)
                      </button>
                    </div>
                  )}

                  {triviaState === 'playing' && (
                    <div className="trivia-quiz" style={{ textAlign: 'left', width: '100%' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-gold)' }}>TRIVIA</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Pregunta {currentQuestion + 1} de {TRIVIA_QUESTIONS.length}</span>
                      </div>

                      <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem', color: 'var(--color-text-dark)', marginBottom: '1.25rem', lineHeight: '1.4' }}>
                        {TRIVIA_QUESTIONS[currentQuestion].question}
                      </h4>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1.25rem' }}>
                        {TRIVIA_QUESTIONS[currentQuestion].options.map((opt, idx) => {
                          const isCorrect = idx === TRIVIA_QUESTIONS[currentQuestion].correct;
                          const isSelected = idx === selectedOption;
                          
                          let btnStyle = {
                            width: '100%',
                            padding: '0.85rem 1rem',
                            textAlign: 'left',
                            borderRadius: 'var(--radius-sm)',
                            border: '1px solid var(--color-border)',
                            backgroundColor: 'var(--color-white)',
                            color: 'var(--color-text-dark)',
                            fontSize: '0.85rem',
                            cursor: answered ? 'default' : 'pointer',
                            transition: 'all 0.2s ease',
                            display: 'block'
                          };

                          if (answered) {
                            if (isCorrect) {
                              btnStyle.backgroundColor = '#d1e7dd';
                              btnStyle.borderColor = '#badbcc';
                              btnStyle.color = '#0f5132';
                              btnStyle.fontWeight = '600';
                            } else if (isSelected) {
                              btnStyle.backgroundColor = '#f8d7da';
                              btnStyle.borderColor = '#f5c2c7';
                              btnStyle.color = '#842029';
                            } else {
                              btnStyle.opacity = 0.5;
                            }
                          }

                          return (
                            <button
                              key={idx}
                              type="button"
                              style={btnStyle}
                              onClick={() => handleSelectOption(idx)}
                              disabled={answered}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>

                      {answered && (
                        <div className="animate-fade-in" style={{ backgroundColor: 'var(--bg-crema-alt)', padding: '0.85rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.25rem', borderLeft: '3px solid var(--color-gold)' }}>
                          <span style={{ fontSize: '0.75rem', fontWeight: 600, display: 'block', color: 'var(--color-gold)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                            {selectedOption === TRIVIA_QUESTIONS[currentQuestion].correct ? '¡Correcto! 🌟' : 'Incorrecto 😢'}
                          </span>
                          <p style={{ fontSize: '0.8rem', color: 'var(--color-text-dark)', margin: 0, lineHeight: '1.4' }}>
                            {TRIVIA_QUESTIONS[currentQuestion].explicacion}
                          </p>
                        </div>
                      )}

                      {answered && (
                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={handleNextQuestion}
                          style={{ width: '100%' }}
                        >
                          {currentQuestion === TRIVIA_QUESTIONS.length - 1 ? 'Ver resultados ➔' : 'Siguiente pregunta ➔'}
                        </button>
                      )}
                    </div>
                  )}

                  {triviaState === 'finished' && (
                    <div style={{ textAlign: 'center', width: '100%' }}>
                      <div className="success-icon" style={{ margin: '0 auto 1rem auto', backgroundColor: '#d1e7dd', color: '#0f5132' }}>
                        🏆
                      </div>
                      <h4 className="success-title">¡Trivia Completada!</h4>
                      <p style={{ fontSize: '1.3rem', fontWeight: 'bold', color: 'var(--color-gold)', margin: '0.4rem 0' }}>
                        {score} de {TRIVIA_QUESTIONS.length} aciertos
                      </p>
                      
                      <p className="success-text" style={{ fontSize: '0.85rem', marginBottom: '1.25rem', lineHeight: '1.4' }}>
                        {score === TRIVIA_QUESTIONS.length 
                          ? '¡Excelente! Conocés a los novios a la perfección. 😍' 
                          : '¡Buen intento! Demostraste conocer mucho sobre ellos. 😊'}
                      </p>
                      
                      <div style={{ border: '1px dashed var(--color-gold)', padding: '0.85rem', borderRadius: 'var(--radius-md)', backgroundColor: '#faf7f1', marginBottom: '1.25rem' }}>
                        <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '0.25rem', fontWeight: 600 }}>Premio Sorpresa</span>
                        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-dark)', fontWeight: 600, margin: '0 0 0.4rem 0', lineHeight: '1.3' }}>
                          🎁 Trago especial gratis en la barra
                        </p>
                        <p style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', margin: 0, fontStyle: 'italic', lineHeight: '1.3' }}>
                          Sacale una captura a esta pantalla y presentala en la barra de tragos durante la fiesta para reclamar tu premio.
                        </p>
                      </div>

                      <button type="button" className="btn btn-primary" onClick={onClose} style={{ width: '100%' }}>
                        Finalizar y Cerrar
                      </button>
                    </div>
                  )}
                </div>
              )}
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

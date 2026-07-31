import React, { useState, useEffect } from 'react';
import { X, Check, AlertCircle, Loader, ArrowRight, ArrowLeft, Users, ShieldAlert } from 'lucide-react';

export default function RSVPModal({ isOpen, onClose, onSubmit }) {
  // Wizard steps:
  // 0 = Kids Warning
  // 1 = Attendance choice (Sí / No)
  // 2 = Group size selection (if attending)
  // 3 = Guest details form (for 1 or N guests)
  const [step, setStep] = useState(0);

  const [asiste, setAsiste] = useState(null); // true = sí, false = no
  const [groupSize, setGroupSize] = useState(1);
  const [groupGuests, setGroupGuests] = useState([
    { nombre: '', apellido: '', dni: '', restricciones: '' }
  ]);
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

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setStep(0);
      setAsiste(null);
      setGroupSize(1);
      setGroupGuests([{ nombre: '', apellido: '', dni: '', restricciones: '' }]);
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

  const handleDniChange = (index, val) => {
    const numericVal = val.replace(/\D/g, ''); // Numbers only
    const updated = [...groupGuests];
    updated[index].dni = numericVal;
    setGroupGuests(updated);
  };

  const handleFieldChange = (index, field, val) => {
    const updated = [...groupGuests];
    updated[index][field] = val;
    setGroupGuests(updated);
  };

  const handleGroupSizeChange = (size) => {
    const intSize = parseInt(size);
    setGroupSize(intSize);
    
    let updated = [...groupGuests];
    if (intSize > updated.length) {
      // Add empty guest structures
      for (let i = updated.length; i < intSize; i++) {
        updated.push({ nombre: '', apellido: '', dni: '', restricciones: '' });
      }
    } else if (intSize < updated.length) {
      // Trim guest structures
      updated = updated.slice(0, intSize);
    }
    setGroupGuests(updated);
  };

  const validateCurrentStep = () => {
    const newErrors = {};

    if (step === 1) {
      if (asiste === null) {
        newErrors.asiste = 'Debe seleccionar una respuesta.';
      }
    }

    if (step === 3) {
      groupGuests.forEach((g, idx) => {
        if (!g.nombre.trim()) {
          newErrors[`nombre_${idx}`] = `El nombre del invitado ${idx + 1} es obligatorio.`;
        }
        if (!g.apellido.trim()) {
          newErrors[`apellido_${idx}`] = `El apellido del invitado ${idx + 1} es obligatorio.`;
        }
        if (!g.dni.trim()) {
          newErrors[`dni_${idx}`] = `El DNI del invitado ${idx + 1} es obligatorio.`;
        } else if (!/^\d+$/.test(g.dni)) {
          newErrors[`dni_${idx}`] = `El DNI del invitado ${idx + 1} debe contener solo números.`;
        }
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (!validateCurrentStep()) return;

    if (step === 0) {
      setStep(1); // Proceed from kids warning to attendance choice
    } else if (step === 1) {
      if (asiste === true) {
        setStep(2); // Go to group size selection
      } else {
        // If not attending, set group size to 1 and skip directly to details form
        setGroupSize(1);
        setGroupGuests([{ nombre: '', apellido: '', dni: '', restricciones: '' }]);
        setStep(3);
      }
    } else if (step === 2) {
      setStep(3); // Go to details form
    }
  };

  const prevStep = () => {
    if (step === 1) {
      setStep(0);
    } else if (step === 2) {
      setStep(1);
    } else if (step === 3) {
      if (asiste === true) {
        setStep(2);
      } else {
        setStep(1);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateCurrentStep()) return;

    setIsSubmitting(true);
    setSubmitError('');

    try {
      if (asiste === true) {
        // Submit all group guests as an array of individual RSVPs
        const payload = groupGuests.map((g, idx) => ({
          nombre: g.nombre.trim(),
          apellido: g.apellido.trim(),
          dni: g.dni.trim(),
          asiste: true,
          restricciones_alimentarias: g.restricciones.trim() || 'Ninguna',
          comentarios: idx === 0 ? (comentarios.trim() || `[Grupo de ${groupSize}]`) : `[Grupo de ${groupSize}]`
        }));
        await onSubmit(payload);
      } else {
        // Submit single guest not attending
        const payload = {
          nombre: groupGuests[0].nombre.trim(),
          apellido: groupGuests[0].apellido.trim(),
          dni: groupGuests[0].dni.trim(),
          asiste: false,
          restricciones_alimentarias: 'Ninguna',
          comentarios: comentarios.trim() || ''
        };
        await onSubmit(payload);
      }
      setIsSuccess(true);
    } catch (err) {
      setSubmitError(err.message || 'Ocurrió un error al guardar la confirmación. Intentá de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container" style={{ maxWidth: step === 3 && groupSize > 1 ? '550px' : '450px' }}>
        <div className="modal-header">
          <h3 className="modal-title">Confirmar Asistencia</h3>
          <button className="modal-close-btn" onClick={onClose} aria-label="Cerrar">
            <X size={20} />
          </button>
        </div>

        <div className="modal-body" style={{ position: 'relative', maxHeight: '75vh', overflowY: 'auto' }}>
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
                        <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '0.25rem', fontWeight: 600 }}>Premio Sorpresa</span>
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
            <div>
              {/* STEP 0: Kids warning screen */}
              {step === 0 && (
                <div className="animate-fade-in-up" style={{ textAlign: 'center', padding: '1rem 0' }}>
                  <div style={{ color: '#8a6508', backgroundColor: '#faf7f1', width: '56px', height: '56px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem auto', border: '1px solid rgba(197, 160, 89, 0.4)' }}>
                    <ShieldAlert size={28} />
                  </div>
                  <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: 'var(--color-olive)', marginBottom: '1rem' }}>
                    Información Importante
                  </h4>
                  <p style={{ fontSize: '0.88rem', color: 'var(--color-text-dark)', lineHeight: '1.6', marginBottom: '2rem', textAlign: 'center' }}>
                    Queridos invitados: para que puedan disfrutar de la fiesta al máximo y relajarse por completo, hemos decidido realizar un evento <strong>exclusivo para adultos (sin niños)</strong>. ¡Agradecemos de corazón su comprensión y apoyo!
                  </p>
                  <button 
                    type="button" 
                    className="btn btn-primary" 
                    onClick={nextStep}
                    style={{ width: '100%', display: 'flex', gap: '0.5rem', justifyContent: 'center', alignItems: 'center' }}
                  >
                    Entendido, Continuar
                    <ArrowRight size={16} />
                  </button>
                </div>
              )}

              {/* STEP 1: Attendance option */}
              {step === 1 && (
                <div className="animate-fade-in-up" style={{ padding: '0.5rem 0' }}>
                  <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)', marginBottom: '1.5rem', textAlign: 'left' }}>
                    Por favor, indicanos si vas a poder acompañarnos en nuestro gran día:
                  </p>
                  
                  <div className="form-group">
                    <div className="radio-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      <label className={`radio-label ${asiste === true ? 'selected' : ''}`} style={{ padding: '1rem' }}>
                        <input 
                          type="radio" 
                          name="asiste" 
                          className="radio-input" 
                          checked={asiste === true} 
                          onChange={() => setAsiste(true)} 
                        />
                        Sí, confirmo asistencia
                      </label>
                      <label className={`radio-label ${asiste === false ? 'selected' : ''}`} style={{ padding: '1rem' }}>
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
                    {errors.asiste && <span className="error-message" style={{ marginTop: '0.5rem', display: 'flex' }}><AlertCircle size={12} /> {errors.asiste}</span>}
                  </div>

                  <div style={{ display: 'flex', gap: '0.75rem', marginTop: '2rem' }}>
                    <button type="button" className="btn btn-secondary" onClick={prevStep} style={{ flex: 1, display: 'flex', gap: '0.5rem', justifyContent: 'center', alignItems: 'center' }}>
                      <ArrowLeft size={16} /> Volver
                    </button>
                    <button type="button" className="btn btn-primary" onClick={nextStep} style={{ flex: 1, display: 'flex', gap: '0.5rem', justifyContent: 'center', alignItems: 'center' }}>
                      Siguiente <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: Group size selection (attending only) */}
              {step === 2 && (
                <div className="animate-fade-in-up" style={{ padding: '0.5rem 0' }}>
                  <div style={{ color: 'var(--color-olive)', backgroundColor: 'var(--bg-crema-alt)', width: '56px', height: '56px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem auto', border: '1px solid rgba(197, 160, 89, 0.2)' }}>
                    <Users size={26} />
                  </div>
                  
                  <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', color: 'var(--color-olive)', marginBottom: '1rem', textAlign: 'center' }}>
                    ¿Cuántos asisten en tu grupo?
                  </h4>
                  
                  <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '1.5rem', textAlign: 'center' }}>
                    Seleccioná la cantidad total de personas que vas a confirmar:
                  </p>

                  <div className="form-group" style={{ maxWidth: '180px', margin: '0 auto' }}>
                    <select 
                      className="form-input" 
                      value={groupSize} 
                      onChange={(e) => handleGroupSizeChange(e.target.value)}
                      style={{ fontSize: '1rem', padding: '0.75rem', textAlign: 'center', fontWeight: 'bold' }}
                    >
                      {[1, 2, 3, 4, 5, 6].map(num => (
                        <option key={num} value={num}>{num} {num === 1 ? 'Invitado' : 'Invitados'}</option>
                      ))}
                    </select>
                  </div>

                  <div style={{ display: 'flex', gap: '0.75rem', marginTop: '2.5rem' }}>
                    <button type="button" className="btn btn-secondary" onClick={prevStep} style={{ flex: 1, display: 'flex', gap: '0.5rem', justifyContent: 'center', alignItems: 'center' }}>
                      <ArrowLeft size={16} /> Volver
                    </button>
                    <button type="button" className="btn btn-primary" onClick={nextStep} style={{ flex: 1, display: 'flex', gap: '0.5rem', justifyContent: 'center', alignItems: 'center' }}>
                      Continuar <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: Guest details form */}
              {step === 3 && (
                <form onSubmit={handleSubmit} className="animate-fade-in-up" style={{ padding: '0.25rem 0' }}>
                  {submitError && (
                    <div className="admin-login-error" style={{ marginBottom: '1.25rem' }}>
                      <AlertCircle size={18} />
                      <span>{submitError}</span>
                    </div>
                  )}

                  <div style={{ maxHeight: '42vh', overflowY: 'auto', paddingRight: '0.25rem', marginBottom: '1.25rem' }}>
                    {groupGuests.map((guest, idx) => (
                      <div 
                        key={idx} 
                        style={{ 
                          border: '1px solid rgba(197, 160, 89, 0.2)', 
                          borderRadius: '8px', 
                          padding: '1.25rem', 
                          marginBottom: '1rem', 
                          backgroundColor: 'var(--color-white)',
                          textAlign: 'left'
                        }}
                      >
                        <span style={{ fontWeight: 'bold', fontSize: '0.88rem', color: 'var(--color-olive)', borderBottom: '1px solid #f1ece1', paddingBottom: '0.25rem', marginBottom: '1rem', display: 'block' }}>
                          Invitado {idx + 1} {asiste === true && groupSize > 1 ? `de ${groupSize}` : ''}
                        </span>

                        <div className="form-group">
                          <label className="form-label required" style={{ fontSize: '0.8rem' }}>Nombre</label>
                          <input 
                            type="text" 
                            className="form-input" 
                            value={guest.nombre} 
                            onChange={(e) => handleFieldChange(idx, 'nombre', e.target.value)} 
                            placeholder="Nombre"
                          />
                          {errors[`nombre_${idx}`] && <span className="error-message"><AlertCircle size={10} /> {errors[`nombre_${idx}`]}</span>}
                        </div>

                        <div className="form-group">
                          <label className="form-label required" style={{ fontSize: '0.8rem' }}>Apellido</label>
                          <input 
                            type="text" 
                            className="form-input" 
                            value={guest.apellido} 
                            onChange={(e) => handleFieldChange(idx, 'apellido', e.target.value)} 
                            placeholder="Apellido"
                          />
                          {errors[`apellido_${idx}`] && <span className="error-message"><AlertCircle size={10} /> {errors[`apellido_${idx}`]}</span>}
                        </div>

                        <div className="form-group">
                          <label className="form-label required" style={{ fontSize: '0.8rem' }}>DNI (Solo números)</label>
                          <input 
                            type="text" 
                            className="form-input" 
                            value={guest.dni} 
                            onChange={(e) => handleDniChange(idx, e.target.value)} 
                            placeholder="DNI"
                            inputMode="numeric"
                          />
                          {errors[`dni_${idx}`] && <span className="error-message"><AlertCircle size={10} /> {errors[`dni_${idx}`]}</span>}
                        </div>

                        {asiste === true && (
                          <div className="form-group">
                            <label className="form-label" style={{ fontSize: '0.8rem' }}>Restricciones Alimentarias (Opcional)</label>
                            <input 
                              type="text" 
                              className="form-input" 
                              value={guest.restricciones} 
                              onChange={(e) => handleFieldChange(idx, 'restricciones', e.target.value)} 
                              placeholder="Ej: Celíaco, vegetariano, alergias"
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="form-group" style={{ textAlign: 'left' }}>
                    <label className="form-label" htmlFor="group-comments">Comentarios o Mensaje para los novios (Opcional)</label>
                    <textarea 
                      id="group-comments" 
                      className="form-input" 
                      value={comentarios} 
                      onChange={(e) => setComentarios(e.target.value)} 
                      placeholder="Algún mensaje adicional..."
                      style={{ minHeight: '65px', resize: 'vertical' }}
                    />
                  </div>

                  <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                    <button type="button" className="btn btn-secondary" onClick={prevStep} style={{ flex: 1, display: 'flex', gap: '0.5rem', justifyContent: 'center', alignItems: 'center' }}>
                      <ArrowLeft size={16} /> Volver
                    </button>
                    <button 
                      type="submit" 
                      className="btn btn-primary" 
                      disabled={isSubmitting}
                      style={{ flex: 1.5, display: 'flex', gap: '0.5rem', justifyContent: 'center', alignItems: 'center' }}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader size={18} className="animate-spin-slow" />
                          Guardando...
                        </>
                      ) : (
                        <>
                          <Check size={18} />
                          Confirmar ahora
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes confetti-fall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(500px) rotate(720deg); opacity: 0; }
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

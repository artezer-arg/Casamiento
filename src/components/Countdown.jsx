import React, { useState, useEffect } from 'react';

export default function Countdown({ config }) {
  const fecha = config?.evento?.fecha || '2026-10-24';
  const horario = config?.evento?.horario || '17:45';
  const timezoneOffset = '-03:00'; // America/Argentina/Buenos_Aires is UTC-3

  const getTargetDate = () => {
    // Standard ISO-8601 string: YYYY-MM-DDTHH:mm:ss-03:00
    // Ensure seconds are included
    const cleanHorario = horario.length === 5 ? `${horario}:00` : horario;
    return new Date(`${fecha}T${cleanHorario}${timezoneOffset}`);
  };

  const calculateTimeLeft = () => {
    const target = getTargetDate();
    const now = new Date();
    const difference = target.getTime() - now.getTime();

    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        dias: Math.floor(difference / (1000 * 60 * 60 * 24)),
        horas: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutos: Math.floor((difference / 1000 / 60) % 60),
        segundos: Math.floor((difference / 1000) % 60),
      };
    } else {
      timeLeft = null; // Countdown finished
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    // Initial check
    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [fecha, horario]);

  return (
    <section id="cuenta-regresiva" className="phrase-container">
      {/* Decorative foliage SVG top left */}
      <svg className="bg-leaves bg-leaves-top-right" viewBox="0 0 100 100" style={{ opacity: 0.08 }}>
        <path d="M10,80 Q50,40 80,10 Q60,40 50,80" fill="none" stroke="currentColor" strokeWidth="2"/>
        <path d="M30,60 Q20,40 10,50 M50,40 Q40,20 30,30 M70,20 Q60,5 50,15" fill="none" stroke="currentColor" strokeWidth="1.5"/>
      </svg>

      <h2 className="section-title">Falta muy poco</h2>
      <p className="section-subtitle">Cuenta regresiva</p>

      {timeLeft ? (
        <div className="countdown-grid">
          <div className="countdown-card">
            <span className="countdown-number">{String(timeLeft.dias).padStart(2, '0')}</span>
            <span className="countdown-label">Días</span>
          </div>
          <div className="countdown-card">
            <span className="countdown-number">{String(timeLeft.horas).padStart(2, '0')}</span>
            <span className="countdown-label">Hs</span>
          </div>
          <div className="countdown-card">
            <span className="countdown-number">{String(timeLeft.minutos).padStart(2, '0')}</span>
            <span className="countdown-label">Min</span>
          </div>
          <div className="countdown-card">
            <span className="countdown-number">{String(timeLeft.segundos).padStart(2, '0')}</span>
            <span className="countdown-label">Seg</span>
          </div>
        </div>
      ) : (
        <div className="countdown-finished animate-pulse-slow">
          ¡Llegó nuestro gran día!
        </div>
      )}
    </section>
  );
}

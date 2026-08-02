import React, { useState, useRef, useEffect } from 'react';
import { MapPin, Calendar, Map, Check, Church, Martini, Sparkles, Utensils, Music, Moon, Heart } from 'lucide-react';

export default function Details({ config }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const evento = config?.evento || {};
  const fecha = evento.fecha || '2026-10-24';
  const horario = evento.horario || '17:45';
  const lugar = evento.lugar || 'Las Moras Eventos';
  const direccion = evento.direccion || 'Mateo Blanco 369, Campana, Buenos Aires';
  const mapsUrl = evento.maps_url || 'https://maps.google.com/?q=Las+Moras+Eventos+Mateo+Blanco+369+Campana';
  const horaFinalizacion = evento.hora_finalizacion || '04:00';
  const calTitulo = evento.calendario_titulo || 'Casamiento de Nestor y Pame';
  const calDesc = evento.calendario_descripcion || '¡Acompañanos a celebrar nuestro casamiento!';

  // Format date display: e.g. "Sábado 24 de Octubre de 2026"
  const getFormattedDate = () => {
    if (fecha === '2026-10-24') return 'Sábado 24 de Octubre de 2026';
    try {
      const parts = fecha.split('-');
      const d = new Date(parts[0], parts[1] - 1, parts[2]);
      const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
      const str = d.toLocaleDateString('es-AR', options);
      return str.charAt(0).toUpperCase() + str.slice(1);
    } catch (e) {
      return 'Sábado 24 de Octubre de 2026';
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getDates = () => {
    const startIsoStr = `${fecha}T${horario.substring(0, 5)}:00-03:00`;
    const startDate = new Date(startIsoStr);
    const endDate = new Date(startDate.getTime());
    const [endH, endM] = horaFinalizacion.split(':').map(Number);
    endDate.setHours(endH);
    endDate.setMinutes(endM);
    if (endDate.getTime() <= startDate.getTime()) {
      endDate.setDate(endDate.getDate() + 1);
    }
    return { startDate, endDate };
  };

  const formatUTC = (date) => {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };

  const getGoogleCalendarUrl = () => {
    const { startDate, endDate } = getDates();
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(calTitulo)}&dates=${formatUTC(startDate)}/${formatUTC(endDate)}&details=${encodeURIComponent(calDesc)}&location=${encodeURIComponent(direccion)}`;
  };

  const getOutlookCalendarUrl = () => {
    const { startDate, endDate } = getDates();
    return `https://outlook.live.com/calendar/0/deeplink/compose?path=/calendar/action/compose&rru=addevent&subject=${encodeURIComponent(calTitulo)}&startdt=${startDate.toISOString()}&enddt=${endDate.toISOString()}&body=${encodeURIComponent(calDesc)}&location=${encodeURIComponent(direccion)}`;
  };

  const downloadICS = () => {
    const { startDate, endDate } = getDates();
    const formatICS = (date) => date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const content = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'BEGIN:VEVENT',
      `UID:wedding-${Date.now()}@nestorypame.com`,
      `DTSTAMP:${formatICS(new Date())}`,
      `DTSTART:${formatICS(startDate)}`,
      `DTEND:${formatICS(endDate)}`,
      `SUMMARY:${calTitulo}`,
      `DESCRIPTION:${calDesc}`,
      `LOCATION:${direccion}`,
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Casamiento_Nestor_y_Pame.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setShowDropdown(false);
  };

  const timelineEvents = [
    { time: '17:45 HS', desc: 'Ceremonia Religiosa', icon: Church },
    { time: '18:30 HS', desc: 'Cóctel de bienvenida', icon: Martini },
    { time: '19:45 HS', desc: 'Entrada de los novios', icon: Sparkles },
    { time: '20:00 HS', desc: 'Cena y brindis', icon: Utensils },
    { time: '21:00 HS', desc: '¡Inicio de la tanda de baile!', icon: Music },
    { time: '04:00 HS', desc: 'Fin de fiesta y despedida', icon: Moon }
  ];

  return (
    <section id="ceremonia-y-fiesta" style={{ padding: '2rem 1.5rem', position: 'relative' }}>
      
      {/* 1. Ceremonia Religiosa details */}
      <div style={{ textAlign: 'center', margin: '1rem 0' }}>
        <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--color-gold)', fontWeight: 600 }}>17:45 hs</span>
        <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: 'var(--color-text-dark)', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0.35rem 0' }}>Ceremonia Religiosa</h3>
        <p style={{ fontFamily: 'var(--font-serif)', fontSize: '0.85rem', color: 'var(--color-text-muted)', margin: '0.2rem 0 1rem 0' }}>
          {lugar}<br />
          <span style={{ fontSize: '0.75rem' }}>{direccion}</span>
        </p>
        <a 
          href={mapsUrl} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="design-btn-dark"
        >
          <MapPin size={14} />
          Ver Ubicación
        </a>
      </div>

      {/* Separator */}
      <div className="design-separator">
        <Heart size={10} className="design-separator-heart" fill="currentColor" strokeWidth={0} />
      </div>

      {/* 2. Recepción & Fiesta details */}
      <div style={{ textAlign: 'center', margin: '1.5rem 0' }}>
        <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--color-gold)', fontWeight: 600 }}>20:00 hs</span>
        <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: 'var(--color-text-dark)', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0.35rem 0' }}>Recepción & Fiesta</h3>
        <p style={{ fontFamily: 'var(--font-serif)', fontSize: '0.85rem', color: 'var(--color-text-muted)', margin: '0.2rem 0 1rem 0' }}>
          {lugar} (Salón Principal)<br />
          <span style={{ fontSize: '0.75rem' }}>{direccion}</span>
        </p>
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a 
            href={mapsUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="design-btn-dark"
          >
            <MapPin size={14} />
            Ver Ubicación
          </a>

          {/* Calendar dropdown button inside layout style */}
          <div style={{ position: 'relative' }} ref={dropdownRef}>
            <button 
              className="design-btn-dark" 
              onClick={() => setShowDropdown(!showDropdown)}
              style={{ backgroundColor: 'var(--color-olive)' }}
            >
              <Calendar size={14} />
              Agendar boda
            </button>
            {showDropdown && (
              <div className="calendar-options-dropdown" style={{ bottom: '110%', left: '50%', transform: 'translateX(-50%)', top: 'auto', marginBottom: '0.5rem', width: '200px' }}>
                <a 
                  href={getGoogleCalendarUrl()} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="calendar-option-btn"
                  onClick={() => setShowDropdown(false)}
                >
                  Google Calendar
                </a>
                <a 
                  href={getOutlookCalendarUrl()} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="calendar-option-btn"
                  onClick={() => setShowDropdown(false)}
                >
                  Outlook Web
                </a>
                <button 
                  type="button" 
                  onClick={downloadICS} 
                  className="calendar-option-btn"
                >
                  Descargar archivo .ics
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Separator */}
      <div className="design-separator">
        <Heart size={10} className="design-separator-heart" fill="currentColor" strokeWidth={0} />
      </div>

      {/* 3. Timeline / Itinerary section with Watercolor wash */}
      <div style={{ position: 'relative', overflow: 'hidden', padding: '2rem 1.5rem', margin: '2rem 0', borderRadius: '12px', border: '1px solid rgba(131, 155, 122, 0.15)' }}>
        
        {/* Soft Sage Green Watercolor Wash stain */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'radial-gradient(circle at 60% 50%, rgba(131, 155, 122, 0.18) 0%, rgba(131, 155, 122, 0.06) 65%, rgba(0,0,0,0) 100%)',
          pointerEvents: 'none',
          zIndex: 0
        }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.65rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--color-text-muted)', fontWeight: 600, display: 'block', textAlign: 'center', marginBottom: '0.25rem' }}>Cronograma</span>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: 'var(--color-olive-dark)', textTransform: 'uppercase', letterSpacing: '0.1em', textAlign: 'center', marginBottom: '2rem' }}>Itinerario del Día</h3>

          <div className="timeline-list">
            {timelineEvents.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div className="timeline-event-item" key={idx}>
                  <div className="timeline-event-icon-circle">
                    <Icon size={12} strokeWidth={2} />
                  </div>
                  <span className="timeline-event-time">{item.time}</span>
                  <span className="timeline-event-desc">{item.desc}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

    </section>
  );
}

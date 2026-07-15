import React, { useState, useRef, useEffect } from 'react';
import { MapPin, Calendar, Map, Check } from 'lucide-react';

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
  const descripcionText = evento.ceremonia_fiesta_text || 'La ceremonia y la fiesta se realizarán en el mismo lugar. Luego de la ceremonia, continuaremos celebrando juntos.';
  const calTitulo = evento.calendario_titulo || 'Casamiento de Nestor y Pame';
  const calDesc = evento.calendario_descripcion || '¡Acompañanos a celebrar nuestro casamiento!';

  // Format date display: e.g. "Sábado 24 de Octubre de 2026"
  const getFormattedDate = () => {
    // Hardcoded initial default for safety, otherwise parse
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

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Compute dates for calendars
  const getDates = () => {
    // Argentina offset is UTC-3
    const startIsoStr = `${fecha}T${horario.substring(0, 5)}:00-03:00`;
    const startDate = new Date(startIsoStr);
    
    const endDate = new Date(startDate.getTime());
    const [endH, endM] = horaFinalizacion.split(':').map(Number);
    endDate.setHours(endH);
    endDate.setMinutes(endM);
    
    // If end time is earlier than start time, it means next day
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

  return (
    <section id="ceremonia-y-fiesta" style={{ position: 'relative' }}>
      <h2 className="section-title">Ceremonia y Fiesta</h2>
      <p className="section-subtitle">Cuándo y Dónde</p>

      <div className="arch-card-wrapper">
        <div className="arch-card animate-fade-in-up">
          {/* Botanical leaf icon top center */}
          <div style={{ color: 'var(--color-gold)', display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
            <MapPin size={32} strokeWidth={1.5} />
          </div>

          <div className="details-item">
            <span className="details-label">Día</span>
            <span className="details-value">{getFormattedDate()}</span>
          </div>

          <div className="details-item">
            <span className="details-label">Horario</span>
            <span className="details-value">{horario.substring(0, 5)} hs</span>
          </div>

          <div className="details-item" style={{ marginBottom: '1rem' }}>
            <span className="details-label">Lugar</span>
            <span className="details-value" style={{ fontWeight: 600 }}>{lugar}</span>
            <span className="details-value-sub">{direccion}</span>
          </div>

          <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', fontStyle: 'italic', margin: '0.5rem 0', lineHeight: '1.5' }}>
            {descripcionText}
          </p>

          <div className="details-buttons">
            <a 
              href={mapsUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn btn-primary"
            >
              <Map size={18} />
              Cómo llegar
            </a>

            <div className="agenda-wrapper" ref={dropdownRef}>
              <button 
                className="btn btn-secondary" 
                onClick={() => setShowDropdown(!showDropdown)}
                style={{ width: '100%' }}
              >
                <Calendar size={18} />
                Agendar evento
              </button>

              {showDropdown && (
                <div className="calendar-options-dropdown" style={{ bottom: '100%', top: 'auto', marginBottom: '0.5rem' }}>
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
      </div>
    </section>
  );
}

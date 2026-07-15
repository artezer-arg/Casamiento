import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { dbClient } from '../db/dbClient';
import { 
  LayoutDashboard, Info, Calendar, Image, Music, Gift, 
  Music2, MessageSquare, Shirt, CheckSquare, Settings, LogOut, 
  Plus, Trash2, Edit3, Save, Globe, Eye, Upload, Search, Download, 
  ExternalLink, Check, Copy, AlertCircle, RefreshCw, Smartphone, Tablet, Monitor
} from 'lucide-react';

const Instagram = ({ size = 24, strokeWidth = 2, className = '' }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth={strokeWidth} 
    strokeLinecap="round" 
    strokeLinejoin="round"
    className={className}
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);
import Invitation from './Invitation';

export default function AdminPanel() {
  const { 
    draftConfig, publishedConfig, draftPhotos, 
    updateDraft, publishChanges, logout, currentUser,
    isPreview, setIsPreview, previewSize, setPreviewSize
  } = useAppContext();

  const [activeSection, setActiveSection] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Local Form States
  const [generalForm, setGeneralForm] = useState({});
  const [eventoForm, setEventoForm] = useState({});
  const [enlacesForm, setEnlacesForm] = useState({});
  const [regalosForm, setRegalosForm] = useState({});
  const [musicaForm, setMusicaForm] = useState({});

  // Dynamic Data Lists
  const [confirmations, setConfirmations] = useState([]);
  const [songs, setSongs] = useState([]);
  const [history, setHistory] = useState([]);
  
  // UI states
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [toast, setToast] = useState(null);
  const [confirmPublishOpen, setConfirmPublishOpen] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Edit Modals
  const [editRsvp, setEditRsvp] = useState(null);
  const [editSong, setEditSong] = useState(null);

  // Search & Filter States
  const [rsvpSearch, setRsvpSearch] = useState('');
  const [rsvpAttendingFilter, setRsvpAttendingFilter] = useState('todos');
  const [songSearch, setSongSearch] = useState('');

  // Initial Form Seeding
  useEffect(() => {
    if (draftConfig) {
      setGeneralForm(draftConfig.general || {});
      setEventoForm(draftConfig.evento || {});
      setEnlacesForm(draftConfig.enlaces || {});
      setRegalosForm(draftConfig.regalos || {});
      setMusicaForm(draftConfig.musica || {});
    }
  }, [draftConfig]);

  // Load confirmations, songs and history
  const loadDynamicData = async () => {
    try {
      const [rsvps, sugSongs, hist] = await Promise.all([
        dbClient.confirmations.list(),
        dbClient.songs.list(),
        dbClient.history.list()
      ]);
      setConfirmations(rsvps);
      setSongs(sugSongs);
      setHistory(hist);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadDynamicData();
  }, []);

  // Detect Unsaved Changes
  useEffect(() => {
    if (!draftConfig) return;
    const isGeneralDiff = JSON.stringify(generalForm) !== JSON.stringify(draftConfig.general);
    const isEventoDiff = JSON.stringify(eventoForm) !== JSON.stringify(draftConfig.evento);
    const isEnlacesDiff = JSON.stringify(enlacesForm) !== JSON.stringify(draftConfig.enlaces);
    const isRegalosDiff = JSON.stringify(regalosForm) !== JSON.stringify(draftConfig.regalos);
    const isMusicaDiff = JSON.stringify(musicaForm) !== JSON.stringify(draftConfig.musica);

    setHasUnsavedChanges(isGeneralDiff || isEventoDiff || isEnlacesDiff || isRegalosDiff || isMusicaDiff);
  }, [generalForm, eventoForm, enlacesForm, regalosForm, musicaForm, draftConfig]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // -------------------------------------------------------------
  // ACTION HANDLERS
  // -------------------------------------------------------------
  const handleSaveDraft = async () => {
    setIsSaving(true);
    try {
      await Promise.all([
        updateDraft('general', generalForm),
        updateDraft('evento', eventoForm),
        updateDraft('enlaces', enlacesForm),
        updateDraft('regalos', regalosForm),
        updateDraft('musica', musicaForm),
      ]);
      showToast('Borrador guardado correctamente.');
      setHasUnsavedChanges(false);
    } catch (err) {
      showToast('No se pudieron guardar los cambios.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublish = async () => {
    setConfirmPublishOpen(false);
    setIsPublishing(true);
    try {
      // First save draft to make sure all pending inputs are preserved
      await Promise.all([
        updateDraft('general', generalForm),
        updateDraft('evento', eventoForm),
        updateDraft('enlaces', enlacesForm),
        updateDraft('regalos', regalosForm),
        updateDraft('musica', musicaForm),
      ]);
      
      await publishChanges();
      await loadDynamicData();
      showToast('Los cambios fueron publicados correctamente.');
      setHasUnsavedChanges(false);
    } catch (err) {
      showToast('Ocurrió un error al publicar.', 'error');
    } finally {
      setIsPublishing(false);
    }
  };

  // Image Optimization Helper
  const compressImage = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new window.Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 1000;
          const MAX_HEIGHT = 1000;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          
          const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
          resolve(dataUrl);
        };
        img.onerror = (err) => reject(err);
      };
      reader.onerror = (err) => reject(err);
    });
  };

  // Upload Cover / Gallery photos
  const handlePhotoUpload = async (e, type) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    showToast('Comprimiendo y subiendo fotografía...');
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Front-end compression
        const optimizedUrl = await compressImage(file);
        
        // Add to database in draft state
        await dbClient.photos.add('draft', {
          url: optimizedUrl,
          tipo: type,
          orden: draftPhotos.length,
          posicion_encuadre: 'center',
          texto_alternativo: `Foto de ${type === 'portada' ? 'portada' : 'galería'} Nestor y Pame`,
          visible: true
        });
      }
      
      await dbClient.config.publish(currentUser?.email || 'admin@nestorypame.com'); // Trigger context refresh
      showToast('Fotografía subida correctamente.');
    } catch (err) {
      console.error(err);
      showToast('Error al subir la fotografía.', 'error');
    }
  };

  // Delete a photo
  const handlePhotoDelete = async (id) => {
    if (!window.confirm('¿Querés eliminar esta fotografía del borrador?')) return;
    try {
      await dbClient.photos.delete(id);
      showToast('Fotografía eliminada del borrador.');
      // Auto save/publish sequence to sync context
      await dbClient.config.publish(currentUser?.email || 'admin@nestorypame.com');
    } catch (e) {
      showToast('Error al eliminar la foto.', 'error');
    }
  };

  // Update photo details (alignment, alt)
  const handlePhotoUpdate = async (id, field, value) => {
    try {
      await dbClient.photos.update(id, { [field]: value });
      showToast('Atributos de foto actualizados.');
      await dbClient.config.publish(currentUser?.email || 'admin@nestorypame.com');
    } catch (e) {
      showToast('Error al actualizar foto.', 'error');
    }
  };

  // Music upload helper
  const handleMusicUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    showToast('Subiendo archivo de audio...');
    try {
      const url = await dbClient.storage.uploadMusic(file);
      setMusicaForm({
        ...musicaForm,
        cancion_url: url,
        cancion_nombre: file.name.replace(/\.[^/.]+$/, "")
      });
      showToast('Música de fondo cargada.');
    } catch (err) {
      showToast('Error al subir la música.', 'error');
    }
  };

  // -------------------------------------------------------------
  // RSVP CRUD
  // -------------------------------------------------------------
  const handleEditRsvpSubmit = async (e) => {
    e.preventDefault();
    try {
      await dbClient.confirmations.update(editRsvp.id, editRsvp);
      setEditRsvp(null);
      await loadDynamicData();
      showToast('Confirmación actualizada.');
    } catch (err) {
      showToast(err.message || 'Error al guardar.', 'error');
    }
  };

  const handleDeleteRsvp = async (id) => {
    if (!window.confirm('¿Querés eliminar esta respuesta de confirmación?')) return;
    try {
      await dbClient.confirmations.delete(id);
      await loadDynamicData();
      showToast('Respuesta eliminada.');
    } catch (err) {
      showToast('Error al eliminar.', 'error');
    }
  };

  // -------------------------------------------------------------
  // SONGS CRUD
  // -------------------------------------------------------------
  const handleEditSongSubmit = async (e) => {
    e.preventDefault();
    try {
      await dbClient.songs.update(editSong.id, editSong);
      setEditSong(null);
      await loadDynamicData();
      showToast('Sugerencia de canción guardada.');
    } catch (e) {
      showToast('Error al guardar.', 'error');
    }
  };

  const handleDeleteSong = async (id) => {
    if (!window.confirm('¿Querés eliminar esta sugerencia de canción?')) return;
    try {
      await dbClient.songs.delete(id);
      await loadDynamicData();
      showToast('Sugerencia eliminada.');
    } catch (e) {
      showToast('Error al eliminar.', 'error');
    }
  };

  const handleUpdateSongStatus = async (id, estado) => {
    try {
      await dbClient.songs.update(id, { estado });
      await loadDynamicData();
      showToast(`Canción marcada como ${estado}.`);
    } catch (e) {
      showToast('Error al cambiar estado.', 'error');
    }
  };

  // -------------------------------------------------------------
  // CSV EXPORTERS (Compatible with Excel)
  // -------------------------------------------------------------
  const exportRSVPs = () => {
    const headers = ['Nombre', 'Apellido', 'DNI', 'Asiste', 'Restricciones Alimentarias', 'Comentarios', 'Fecha', 'Hora'];
    const rows = confirmations.map(c => [
      c.nombre, 
      c.apellido, 
      c.dni, 
      c.asiste ? 'SI' : 'NO', 
      c.restricciones_alimentarias || 'Ninguna', 
      c.comentarios || '', 
      c.fecha_respuesta || '', 
      c.hora_respuesta || ''
    ]);
    
    exportToCSV('Confirmaciones_Nestor_y_Pame.csv', headers, rows);
  };

  const exportSongs = () => {
    const headers = ['Invitado', 'Canción', 'Artista', 'Comentario', 'Fecha', 'Estado'];
    const rows = songs.map(s => [
      s.invitado, 
      s.cancion, 
      s.artista, 
      s.comentario || '', 
      s.fecha ? s.fecha.substring(0,10) : '', 
      s.estado
    ]);

    exportToCSV('Canciones_Sugeridas_Nestor_y_Pame.csv', headers, rows);
  };

  const exportToCSV = (filename, headers, rows) => {
    const csvContent = "data:text/csv;charset=utf-8,\uFEFF"
      + [headers.join(','), ...rows.map(row => row.map(val => `"${String(val).replace(/"/g, '""')}"`).join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Statistics Computations
  const stats = {
    total: confirmations.length,
    attending: confirmations.filter(c => c.asiste).length,
    notAttending: confirmations.filter(c => !c.asiste).length,
    totalSongs: songs.length,
    selectedSongs: songs.filter(s => s.estado === 'seleccionada').length
  };

  // Filtered Lists
  const filteredRsvps = confirmations.filter(c => {
    const matchesSearch = [c.nombre, c.apellido, c.dni]
      .some(field => String(field).toLowerCase().includes(rsvpSearch.toLowerCase()));
    
    if (rsvpAttendingFilter === 'asiste') return matchesSearch && c.asiste;
    if (rsvpAttendingFilter === 'no-asiste') return matchesSearch && !c.asiste;
    return matchesSearch;
  });

  const filteredSongs = songs.filter(s => {
    return [s.cancion, s.artista, s.invitado]
      .some(field => String(field).toLowerCase().includes(songSearch.toLowerCase()));
  });

  return (
    <div className="admin-layout">
      {/* Sidebar Mobile Toggle Header */}
      <div className="admin-mobile-header">
        <span className="admin-sidebar-logo">Nestor & Pame</span>
        <button 
          className="admin-btn-action" 
          style={{ color: '#fff' }} 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? <X size={20} /> : <Eye size={20} />}
        </button>
      </div>

      {/* Admin Sidebar */}
      <aside className={`admin-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="admin-sidebar-header">
          <span className="admin-sidebar-logo">Nestor & Pame</span>
          <button 
            className="admin-btn-action" 
            style={{ color: '#fff', border: 'none' }} 
            onClick={() => setIsSidebarOpen(false)}
          >
            <X size={18} />
          </button>
        </div>

        <nav className="admin-nav">
          <button className={`admin-nav-item ${activeSection === 'dashboard' ? 'active' : ''}`} onClick={() => { setActiveSection('dashboard'); setIsSidebarOpen(false); }}>
            <LayoutDashboard size={18} /> Dashboard
          </button>
          <button className={`admin-nav-item ${activeSection === 'general' ? 'active' : ''}`} onClick={() => { setActiveSection('general'); setIsSidebarOpen(false); }}>
            <Info size={18} /> Info General
          </button>
          <button className={`admin-nav-item ${activeSection === 'evento' ? 'active' : ''}`} onClick={() => { setActiveSection('evento'); setIsSidebarOpen(false); }}>
            <Calendar size={18} /> Evento
          </button>
          <button className={`admin-nav-item ${activeSection === 'portada' ? 'active' : ''}`} onClick={() => { setActiveSection('portada'); setIsSidebarOpen(false); }}>
            <Image size={18} /> Fotos
          </button>
          <button className={`admin-nav-item ${activeSection === 'musica' ? 'active' : ''}`} onClick={() => { setActiveSection('musica'); setIsSidebarOpen(false); }}>
            <Music size={18} /> Música
          </button>
          <button className={`admin-nav-item ${activeSection === 'regalos' ? 'active' : ''}`} onClick={() => { setActiveSection('regalos'); setIsSidebarOpen(false); }}>
            <Gift size={18} /> Regalos
          </button>
          <button className={`admin-nav-item ${activeSection === 'instagram' ? 'active' : ''}`} onClick={() => { setActiveSection('instagram'); setIsSidebarOpen(false); }}>
            <Instagram size={18} /> Redes
          </button>
          <button className={`admin-nav-item ${activeSection === 'canciones' ? 'active' : ''}`} onClick={() => { setActiveSection('canciones'); setIsSidebarOpen(false); }}>
            <Music2 size={18} /> Canciones sugeridas
          </button>
          <button className={`admin-nav-item ${activeSection === 'confirmaciones' ? 'active' : ''}`} onClick={() => { setActiveSection('confirmaciones'); setIsSidebarOpen(false); }}>
            <CheckSquare size={18} /> Confirmaciones
          </button>
        </nav>

        <div className="admin-sidebar-footer">
          <button onClick={logout} className="admin-nav-item active" style={{ color: '#ef4444' }}>
            <LogOut size={18} /> Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main Body */}
      <div className="admin-main-wrapper">
        {/* Top Control Bar */}
        <header className="admin-topbar">
          <div>
            <h2 className="admin-topbar-title">Configuración de la Invitación</h2>
            <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>
              Administrador: {currentUser?.email || 'admin@nestorypame.com'}
            </span>
          </div>

          <div className="admin-topbar-actions">
            {hasUnsavedChanges ? (
              <span className="admin-badge-draft">Tenés cambios sin guardar</span>
            ) : (
              <span className="admin-badge-published">Publicado al día</span>
            )}

            <button 
              className="btn btn-secondary" 
              style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}
              onClick={() => {
                setIsPreview(true);
                setPreviewSize('mobile');
              }}
            >
              <Eye size={14} />
              Vista Previa
            </button>

            <button 
              className="btn btn-gold" 
              style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}
              onClick={handleSaveDraft}
              disabled={isSaving}
            >
              <Save size={14} />
              {isSaving ? 'Guardando...' : 'Guardar Borrador'}
            </button>

            <button 
              className="btn btn-primary" 
              style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}
              onClick={() => setConfirmPublishOpen(true)}
              disabled={isPublishing}
            >
              <Globe size={14} />
              {isPublishing ? 'Publicando...' : 'Publicar Cambios'}
            </button>
          </div>
        </header>

        {/* Content Section */}
        <main className="admin-content">
          {/* 1. DASHBOARD */}
          {activeSection === 'dashboard' && (
            <div className="animate-fade-in">
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', fontWeight: 600 }}>Resumen del Casamiento</h3>
              
              <div className="admin-grid-dashboard">
                <div className="admin-stat-card">
                  <div className="admin-stat-icon green">
                    <Check size={24} />
                  </div>
                  <div className="admin-stat-info">
                    <span className="admin-stat-val">{stats.attending}</span>
                    <span className="admin-stat-label">Asistirán</span>
                  </div>
                </div>

                <div className="admin-stat-card">
                  <div className="admin-stat-icon red">
                    <X size={24} />
                  </div>
                  <div className="admin-stat-info">
                    <span className="admin-stat-val">{stats.notAttending}</span>
                    <span className="admin-stat-label">No asistirán</span>
                  </div>
                </div>

                <div className="admin-stat-card">
                  <div className="admin-stat-icon" style={{ backgroundColor: '#e0e7ff', color: '#4f46e5' }}>
                    <MessageSquare size={24} />
                  </div>
                  <div className="admin-stat-info">
                    <span className="admin-stat-val">{stats.total}</span>
                    <span className="admin-stat-label">Total respuestas</span>
                  </div>
                </div>

                <div className="admin-stat-card">
                  <div className="admin-stat-icon" style={{ backgroundColor: '#fef3c7', color: '#d97706' }}>
                    <Music2 size={24} />
                  </div>
                  <div className="admin-stat-info">
                    <span className="admin-stat-val">{stats.totalSongs}</span>
                    <span className="admin-stat-label">Temas sugeridos</span>
                  </div>
                </div>
              </div>

              {/* Quick Actions Card */}
              <div className="admin-card">
                <div className="admin-card-header">
                  <h4 className="admin-card-title">Acciones Rápidas</h4>
                </div>
                <div className="admin-card-body" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <button className="btn btn-secondary" onClick={exportRSVPs}>
                    <Download size={16} /> Exportar Confirmados (CSV)
                  </button>
                  <button className="btn btn-secondary" onClick={exportSongs}>
                    <Download size={16} /> Exportar Playlist Sugerida (CSV)
                  </button>
                  <a href="/" target="_blank" className="btn btn-primary">
                    <ExternalLink size={16} /> Ver Invitación Pública
                  </a>
                </div>
              </div>

              {/* History logs card */}
              <div className="admin-card">
                <div className="admin-card-header">
                  <h4 className="admin-card-title">Historial de Publicaciones</h4>
                </div>
                <div className="admin-card-body">
                  <div className="admin-table-container">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Fecha</th>
                          <th>Publicador</th>
                          <th>Descripción</th>
                        </tr>
                      </thead>
                      <tbody>
                        {history.map((h, i) => (
                          <tr key={h.id || i}>
                            <td>{h.fecha_publicacion ? new Date(h.fecha_publicacion).toLocaleString('es-AR') : 'N/A'}</td>
                            <td>{h.usuario}</td>
                            <td>{h.descripcion}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 2. GENERAL INFO */}
          {activeSection === 'general' && (
            <div className="admin-card">
              <div className="admin-card-header">
                <h4 className="admin-card-title">Información de los Novios</h4>
              </div>
              <div className="admin-card-body">
                <div className="admin-form-grid">
                  <div className="admin-form-group">
                    <label className="admin-label">Nombres de los Novios (Pre-cargado: Nestor y Pame)</label>
                    <input 
                      type="text" 
                      className="admin-input" 
                      value={generalForm.nombres_novios || ''}
                      onChange={(e) => setGeneralForm({ ...generalForm, nombres_novios: e.target.value })}
                      placeholder="Ej: Nestor y Pame"
                      required
                    />
                  </div>
                  
                  <div className="admin-form-group">
                    <label className="admin-label">Texto de Bienvenida</label>
                    <input 
                      type="text" 
                      className="admin-input" 
                      value={generalForm.welcome_text || ''}
                      onChange={(e) => setGeneralForm({ ...generalForm, welcome_text: e.target.value })}
                    />
                  </div>

                  <div className="admin-form-group full-width">
                    <label className="admin-label">Frase Emotiva de Portada</label>
                    <textarea 
                      className="admin-textarea"
                      value={generalForm.frase_emotiva || ''}
                      onChange={(e) => setGeneralForm({ ...generalForm, frase_emotiva: e.target.value })}
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-label">Fecha Límite para RSVP</label>
                    <input 
                      type="datetime-local" 
                      className="admin-input" 
                      value={generalForm.fecha_limite_confirmacion ? generalForm.fecha_limite_confirmacion.substring(0, 16) : ''}
                      onChange={(e) => setGeneralForm({ ...generalForm, fecha_limite_confirmacion: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 3. EVENT INFORMATION */}
          {activeSection === 'evento' && (
            <div className="admin-card">
              <div className="admin-card-header">
                <h4 className="admin-card-title">Fecha, Lugar y Dress Code</h4>
              </div>
              <div className="admin-card-body">
                <div className="admin-form-grid">
                  <div className="admin-form-group">
                    <label className="admin-label">Fecha del Casamiento</label>
                    <input 
                      type="date" 
                      className="admin-input" 
                      value={eventoForm.fecha || ''}
                      onChange={(e) => setEventoForm({ ...eventoForm, fecha: e.target.value })}
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-label">Horario de Inicio</label>
                    <input 
                      type="time" 
                      className="admin-input" 
                      value={eventoForm.horario || ''}
                      onChange={(e) => setEventoForm({ ...eventoForm, horario: e.target.value })}
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-label">Horario de Finalización (Calendario)</label>
                    <input 
                      type="time" 
                      className="admin-input" 
                      value={eventoForm.hora_finalizacion || ''}
                      onChange={(e) => setEventoForm({ ...eventoForm, hora_finalizacion: e.target.value })}
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-label">Zona Horaria</label>
                    <input 
                      type="text" 
                      className="admin-input" 
                      value={eventoForm.zona_horaria || ''}
                      onChange={(e) => setEventoForm({ ...eventoForm, zona_horaria: e.target.value })}
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-label">Nombre del Salón</label>
                    <input 
                      type="text" 
                      className="admin-input" 
                      value={eventoForm.lugar || ''}
                      onChange={(e) => setEventoForm({ ...eventoForm, lugar: e.target.value })}
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-label">Dirección Completa</label>
                    <input 
                      type="text" 
                      className="admin-input" 
                      value={eventoForm.direccion || ''}
                      onChange={(e) => setEventoForm({ ...eventoForm, direccion: e.target.value })}
                    />
                  </div>

                  <div className="admin-form-group full-width">
                    <label className="admin-label">Enlace de Google Maps</label>
                    <input 
                      type="url" 
                      className="admin-input" 
                      value={eventoForm.maps_url || ''}
                      onChange={(e) => setEventoForm({ ...eventoForm, maps_url: e.target.value })}
                    />
                  </div>

                  <div className="admin-form-group full-width">
                    <label className="admin-label">Detalles de la Ceremonia y Fiesta</label>
                    <textarea 
                      className="admin-textarea"
                      value={eventoForm.ceremonia_fiesta_text || ''}
                      onChange={(e) => setEventoForm({ ...eventoForm, ceremonia_fiesta_text: e.target.value })}
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-label">Tipo de Vestimenta (Dress Code)</label>
                    <input 
                      type="text" 
                      className="admin-input" 
                      value={eventoForm.dress_code_tipo || 'Elegante'}
                      onChange={(e) => setEventoForm({ ...eventoForm, dress_code_tipo: e.target.value })}
                    />
                  </div>

                  <div className="admin-form-group full-width">
                    <label className="admin-label">Texto de Vestimenta</label>
                    <input 
                      type="text" 
                      className="admin-input" 
                      value={eventoForm.dress_code_texto || ''}
                      onChange={(e) => setEventoForm({ ...eventoForm, dress_code_texto: e.target.value })}
                    />
                  </div>

                  <div className="admin-form-group full-width">
                    <label className="admin-label">Colores Reservados Explicación</label>
                    <input 
                      type="text" 
                      className="admin-input" 
                      value={eventoForm.dress_code_colores || ''}
                      onChange={(e) => setEventoForm({ ...eventoForm, dress_code_colores: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 4. PHOTOGRAPHS MANAGER */}
          {activeSection === 'portada' && (
            <div className="animate-fade-in">
              {/* Photo Cover manager */}
              <div className="admin-card">
                <div className="admin-card-header">
                  <h4 className="admin-card-title">Foto de Portada Principal</h4>
                </div>
                <div className="admin-card-body">
                  <div className="admin-form-grid" style={{ marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <p style={{ fontSize: '0.85rem', color: '#6b7280' }}>
                        Subí una foto vertical/horizontal que se mostrará a pantalla completa en la portada.
                      </p>
                      
                      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <label className="btn btn-secondary" style={{ padding: '0.5rem 1.25rem', cursor: 'pointer' }}>
                          <Upload size={16} /> Subir nueva portada
                          <input 
                            type="file" 
                            accept="image/*" 
                            style={{ display: 'none' }} 
                            onChange={(e) => handlePhotoUpload(e, 'portada')}
                          />
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Portada Preview */}
                  <div className="admin-photos-grid">
                    {draftPhotos.filter(p => p.tipo === 'portada').map((p) => (
                      <div key={p.id} className="admin-photo-card" style={{ cursor: 'default' }}>
                        <img src={p.url} alt="Cover Preview" />
                        <span className="admin-photo-badge-main">ACTIVA</span>
                        <div className="admin-photo-overlay" style={{ opacity: 1, backgroundColor: 'rgba(0,0,0,0.6)' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', width: '90%', padding: '0.25rem' }}>
                            <label className="admin-label" style={{ color: '#fff', fontSize: '0.65rem' }}>Encuadre</label>
                            <select 
                              className="admin-select"
                              style={{ padding: '0.2rem', fontSize: '0.75rem' }}
                              value={p.posicion_encuadre || 'center'}
                              onChange={(e) => handlePhotoUpdate(p.id, 'posicion_encuadre', e.target.value)}
                            >
                              <option value="center">Centro</option>
                              <option value="top">Arriba</option>
                              <option value="bottom">Abajo</option>
                              <option value="left">Izquierda</option>
                              <option value="right">Derecha</option>
                            </select>
                            <button className="btn btn-secondary delete" style={{ padding: '0.25rem', fontSize: '0.7rem', color: '#fca5a5', borderColor: '#ef4444' }} onClick={() => handlePhotoDelete(p.id)}>
                              Eliminar
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Gallery Photos Grid */}
              <div className="admin-card">
                <div className="admin-card-header">
                  <h4 className="admin-card-title">Galería de Nestor y Pame (4 a 8 fotos)</h4>
                </div>
                <div className="admin-card-body">
                  <p style={{ fontSize: '0.85rem', color: '#6b7280', marginBottom: '1.5rem' }}>
                    Subí fotos horizontales y verticales. Podés arrastrar y soltar archivos o presionar el selector.
                  </p>
                  
                  <div className="admin-photos-grid">
                    {/* Add Photo block */}
                    <label className="admin-upload-zone">
                      <Plus className="admin-upload-icon" />
                      <span>Subir Fotos</span>
                      <span className="admin-upload-text-sm">JPG, PNG, WEBP</span>
                      <input 
                        type="file" 
                        multiple 
                        accept="image/*" 
                        style={{ display: 'none' }} 
                        onChange={(e) => handlePhotoUpload(e, 'galeria')}
                      />
                    </label>

                    {draftPhotos.filter(p => p.tipo === 'galeria').map((p, index) => (
                      <div key={p.id} className="admin-photo-card">
                        <img src={p.url} alt={`Gallery index ${index}`} />
                        <div className="admin-photo-overlay">
                          <button className="admin-photo-btn delete" onClick={() => handlePhotoDelete(p.id)} title="Eliminar">
                            <Trash2 size={16} />
                          </button>
                          <input 
                            type="text" 
                            placeholder="Alt text"
                            className="admin-input" 
                            style={{ position: 'absolute', bottom: '5px', left: '5px', right: '5px', fontSize: '0.7rem', padding: '0.2rem' }}
                            value={p.texto_alternativo || ''}
                            onChange={(e) => handlePhotoUpdate(p.id, 'texto_alternativo', e.target.value)}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 5. BACKGROUND MUSIC SETTINGS */}
          {activeSection === 'musica' && (
            <div className="admin-card">
              <div className="admin-card-header">
                <h4 className="admin-card-title">Música de Fondo de la Invitación</h4>
              </div>
              <div className="admin-card-body">
                <div className="admin-form-grid">
                  <div className="admin-form-group full-width" style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '1.5rem' }}>
                    <label className="admin-label">Subir Archivo de Audio (MP3)</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <label className="btn btn-secondary" style={{ cursor: 'pointer' }}>
                        <Upload size={16} /> Seleccionar Archivo
                        <input 
                          type="file" 
                          accept="audio/mp3,audio/*" 
                          style={{ display: 'none' }} 
                          onChange={handleMusicUpload}
                        />
                      </label>
                      <span style={{ fontSize: '0.85rem', color: '#6b7280' }}>
                        {musicaForm.cancion_url ? 'Archivo de audio cargado correctamente.' : 'Ningún archivo seleccionado.'}
                      </span>
                    </div>
                  </div>

                  <div className="admin-form-group full-width">
                    <label className="admin-label">O Cargar URL de Audio Externa</label>
                    <input 
                      type="url" 
                      className="admin-input" 
                      value={musicaForm.cancion_url || ''}
                      onChange={(e) => setMusicaForm({ ...musicaForm, cancion_url: e.target.value })}
                      placeholder="https://ejemplo.com/musica.mp3"
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-label">Nombre del Tema</label>
                    <input 
                      type="text" 
                      className="admin-input" 
                      value={musicaForm.cancion_nombre || ''}
                      onChange={(e) => setMusicaForm({ ...musicaForm, cancion_nombre: e.target.value })}
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-label">Artista / Grupo</label>
                    <input 
                      type="text" 
                      className="admin-input" 
                      value={musicaForm.artista || ''}
                      onChange={(e) => setMusicaForm({ ...musicaForm, artista: e.target.value })}
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-label">Volumen Inicial ({Math.round(musicaForm.volumen_inicial * 100)}%)</label>
                    <input 
                      type="range" 
                      min="0" 
                      max="1" 
                      step="0.05"
                      className="volume-slider" 
                      style={{ width: '100%', marginTop: '0.5rem' }}
                      value={musicaForm.volumen_inicial || 0.5}
                      onChange={(e) => setMusicaForm({ ...musicaForm, volumen_inicial: parseFloat(e.target.value) })}
                    />
                  </div>

                  <div className="admin-form-group" style={{ justifyContent: 'center' }}>
                    <label className="admin-checkbox-group">
                      <input 
                        type="checkbox" 
                        className="admin-checkbox"
                        checked={musicaForm.visible ?? true}
                        onChange={(e) => setMusicaForm({ ...musicaForm, visible: e.target.checked })}
                      />
                      Habilitar música flotante
                    </label>
                    <label className="admin-checkbox-group">
                      <input 
                        type="checkbox" 
                        className="admin-checkbox"
                        checked={musicaForm.loop ?? true}
                        onChange={(e) => setMusicaForm({ ...musicaForm, loop: e.target.checked })}
                      />
                      Repetición automática (Loop)
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 6. GIFTS SETTINGS */}
          {activeSection === 'regalos' && (
            <div className="admin-card">
              <div className="admin-card-header">
                <h4 className="admin-card-title">Configuración de Regalos y Cuentas</h4>
              </div>
              <div className="admin-card-body">
                <label className="admin-checkbox-group" style={{ marginBottom: '1.5rem', fontWeight: 600 }}>
                  <input 
                    type="checkbox" 
                    className="admin-checkbox"
                    checked={regalosForm.visible ?? true}
                    onChange={(e) => setRegalosForm({ ...regalosForm, visible: e.target.checked })}
                  />
                  Mostrar sección de regalos en la invitación
                </label>

                <div className="admin-form-grid">
                  <div className="admin-form-group">
                    <label className="admin-label">Alias Bancario</label>
                    <input 
                      type="text" 
                      className="admin-input" 
                      value={regalosForm.alias || ''}
                      onChange={(e) => setRegalosForm({ ...regalosForm, alias: e.target.value })}
                      placeholder="Ej: casamiento.nestor.pame"
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-label">Nombre del Titular de la Cuenta</label>
                    <input 
                      type="text" 
                      className="admin-input" 
                      value={regalosForm.titular || ''}
                      onChange={(e) => setRegalosForm({ ...regalosForm, titular: e.target.value })}
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-label">Nombre del Banco</label>
                    <input 
                      type="text" 
                      className="admin-input" 
                      value={regalosForm.banco || ''}
                      onChange={(e) => setRegalosForm({ ...regalosForm, banco: e.target.value })}
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-label">CBU / CVU</label>
                    <input 
                      type="text" 
                      className="admin-input" 
                      value={regalosForm.cbu_cvu || ''}
                      onChange={(e) => setRegalosForm({ ...regalosForm, cbu_cvu: e.target.value })}
                    />
                  </div>

                  <div className="admin-form-group full-width">
                    <label className="admin-label">Texto Descriptivo de Regalos</label>
                    <textarea 
                      className="admin-textarea"
                      value={regalosForm.texto_regalos || ''}
                      onChange={(e) => setRegalosForm({ ...regalosForm, texto_regalos: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 7. INSTAGRAM & EXTERNAL LINKS */}
          {activeSection === 'instagram' && (
            <div className="admin-card">
              <div className="admin-card-header">
                <h4 className="admin-card-title">Instagram y Enlaces</h4>
              </div>
              <div className="admin-card-body">
                <div className="admin-form-grid">
                  <div className="admin-form-group full-width" style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
                    <label className="admin-checkbox-group" style={{ fontWeight: 600 }}>
                      <input 
                        type="checkbox" 
                        className="admin-checkbox"
                        checked={enlacesForm.instagram_visible ?? true}
                        onChange={(e) => setEnlacesForm({ ...enlacesForm, instagram_visible: e.target.checked })}
                      />
                      Habilitar sección de Instagram
                    </label>
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-label">Usuario de Instagram (@)</label>
                    <input 
                      type="text" 
                      className="admin-input" 
                      value={enlacesForm.instagram_user || ''}
                      onChange={(e) => setEnlacesForm({ ...enlacesForm, instagram_user: e.target.value.replace('@', '') })}
                      placeholder="usuario"
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-label">Enlace de Instagram Completo</label>
                    <input 
                      type="url" 
                      className="admin-input" 
                      value={enlacesForm.instagram_url || ''}
                      onChange={(e) => setEnlacesForm({ ...enlacesForm, instagram_url: e.target.value })}
                      placeholder="https://instagram.com/usuario"
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-label">Hashtag del Casamiento</label>
                    <input 
                      type="text" 
                      className="admin-input" 
                      value={enlacesForm.instagram_hashtag || ''}
                      onChange={(e) => setEnlacesForm({ ...enlacesForm, instagram_hashtag: e.target.value })}
                      placeholder="#NestorYPame"
                    />
                  </div>

                  <div className="admin-form-group full-width">
                    <label className="admin-label">Texto Personalizado Instagram</label>
                    <input 
                      type="text" 
                      className="admin-input" 
                      value={enlacesForm.instagram_text || ''}
                      onChange={(e) => setEnlacesForm({ ...enlacesForm, instagram_text: e.target.value })}
                    />
                  </div>

                  <div className="admin-form-group full-width" style={{ borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)', padding: '1.5rem 0', margin: '1.5rem 0' }}>
                    <label className="admin-checkbox-group" style={{ fontWeight: 600 }}>
                      <input 
                        type="checkbox" 
                        className="admin-checkbox"
                        checked={enlacesForm.compartir_fotos_visible ?? true}
                        onChange={(e) => setEnlacesForm({ ...enlacesForm, compartir_fotos_visible: e.target.checked })}
                      />
                      Habilitar sección "Compartir Recuerdos" (Subir fotos)
                    </label>

                    <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      <label className="admin-label">Enlace de Plataforma (Google Photos, Drive, OneDrive, etc.)</label>
                      <input 
                        type="url" 
                        className="admin-input" 
                        value={enlacesForm.compartir_fotos_url || ''}
                        onChange={(e) => setEnlacesForm({ ...enlacesForm, compartir_fotos_url: e.target.value })}
                        placeholder="https://photos.google.com/share/..."
                      />
                    </div>
                  </div>

                  <div className="admin-form-group full-width">
                    <label className="admin-checkbox-group" style={{ fontWeight: 600 }}>
                      <input 
                        type="checkbox" 
                        className="admin-checkbox"
                        checked={enlacesForm.sugerir_canciones_visible ?? true}
                        onChange={(e) => setEnlacesForm({ ...enlacesForm, sugerir_canciones_visible: e.target.checked })}
                      />
                      Habilitar sección "Sugerir canciones"
                    </label>

                    <div style={{ marginTop: '1rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        <label className="admin-label">Modalidad de Sugerencias</label>
                        <select 
                          className="admin-select"
                          value={enlacesForm.sugerir_canciones_modalidad || 'interno'}
                          onChange={(e) => setEnlacesForm({ ...enlacesForm, sugerir_canciones_modalidad: e.target.value })}
                        >
                          <option value="interno">Formulario Interno (Guardar en Base de Datos)</option>
                          <option value="externo">Enlace Externo (Spotify, Google Forms, etc.)</option>
                        </select>
                      </div>
                      
                      {enlacesForm.sugerir_canciones_modalidad === 'externo' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                          <label className="admin-label">Enlace Externo Playlist/Formulario</label>
                          <input 
                            type="url" 
                            className="admin-input" 
                            value={enlacesForm.sugerir_canciones_url || ''}
                            onChange={(e) => setEnlacesForm({ ...enlacesForm, sugerir_canciones_url: e.target.value })}
                            placeholder="https://open.spotify.com/playlist/..."
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 8. SUGGESTED SONGS CRUD LIST */}
          {activeSection === 'canciones' && (
            <div className="admin-card animate-fade-in">
              <div className="admin-card-header">
                <h4 className="admin-card-title font-sans">Canciones Sugeridas por Invitados</h4>
                <button className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }} onClick={exportSongs}>
                  <Download size={14} /> Exportar CSV
                </button>
              </div>

              <div className="admin-card-body">
                <div className="admin-table-filters">
                  <div className="admin-search-wrapper">
                    <Search className="admin-search-icon" size={16} />
                    <input 
                      type="text" 
                      placeholder="Buscar por canción, artista o invitado..." 
                      className="admin-search-input"
                      value={songSearch}
                      onChange={(e) => setSongSearch(e.target.value)}
                    />
                  </div>
                </div>

                <div className="admin-table-container">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Invitado</th>
                        <th>Canción</th>
                        <th>Artista</th>
                        <th>Comentario</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredSongs.length === 0 ? (
                        <tr>
                          <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: '#9ca3af' }}>
                            No se encontraron canciones sugeridas.
                          </td>
                        </tr>
                      ) : (
                        filteredSongs.map((s) => (
                          <tr key={s.id}>
                            <td style={{ fontWeight: 600 }}>{s.invitado}</td>
                            <td>{s.cancion}</td>
                            <td>{s.artista}</td>
                            <td title={s.comentario}>{s.comentario || '—'}</td>
                            <td>
                              <span className={`status-badge ${s.estado}`}>
                                {s.estado.toUpperCase()}
                              </span>
                            </td>
                            <td>
                              <div style={{ display: 'flex', gap: '0.25rem' }}>
                                <button className="admin-btn-action select" onClick={() => handleUpdateSongStatus(s.id, 'seleccionada')} title="Seleccionar">
                                  <Check size={14} />
                                </button>
                                <button className="admin-btn-action" onClick={() => handleUpdateSongStatus(s.id, 'descartada')} title="Descartar">
                                  <X size={14} />
                                </button>
                                <button className="admin-btn-action" onClick={() => {
                                  navigator.clipboard.writeText(`${s.cancion} ${s.artista}`);
                                  showToast('Copiado al portapapeles.');
                                }} title="Copiar nombre">
                                  <Copy size={14} />
                                </button>
                                <a 
                                  href={`https://open.spotify.com/search/${encodeURIComponent(s.cancion + ' ' + s.artista)}`} 
                                  target="_blank" 
                                  rel="noopener noreferrer" 
                                  className="admin-btn-action" 
                                  title="Buscar en Spotify"
                                >
                                  <ExternalLink size={14} />
                                </a>
                                <button className="admin-btn-action" onClick={() => setEditSong(s)} title="Editar">
                                  <Edit3 size={14} />
                                </button>
                                <button className="admin-btn-action delete" onClick={() => handleDeleteSong(s.id)} title="Eliminar">
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 9. RSVP CONFIRMATIONS CRUD LIST */}
          {activeSection === 'confirmaciones' && (
            <div className="admin-card animate-fade-in">
              <div className="admin-card-header">
                <h4 className="admin-card-title font-sans">Listado de Invitados Confirmados</h4>
                <button className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }} onClick={exportRSVPs}>
                  <Download size={14} /> Exportar CSV
                </button>
              </div>

              <div className="admin-card-body">
                <div className="admin-table-filters">
                  <div className="admin-search-wrapper">
                    <Search className="admin-search-icon" size={16} />
                    <input 
                      type="text" 
                      placeholder="Buscar por nombre, apellido, DNI..." 
                      className="admin-search-input"
                      value={rsvpSearch}
                      onChange={(e) => setRsvpSearch(e.target.value)}
                    />
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>Filtrar Asistencia:</span>
                    <select 
                      className="admin-select"
                      style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}
                      value={rsvpAttendingFilter}
                      onChange={(e) => setRsvpAttendingFilter(e.target.value)}
                    >
                      <option value="todos">Todos</option>
                      <option value="asiste">Asisten</option>
                      <option value="no-asiste">No asisten</option>
                    </select>
                  </div>
                </div>

                <div className="admin-table-container">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>DNI</th>
                        <th>Nombre y Apellido</th>
                        <th>Asiste</th>
                        <th>Restricciones alimentarias</th>
                        <th>Comentarios</th>
                        <th>Fecha de confirmación</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredRsvps.length === 0 ? (
                        <tr>
                          <td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: '#9ca3af' }}>
                            No se encontraron confirmaciones de asistencia.
                          </td>
                        </tr>
                      ) : (
                        filteredRsvps.map((c) => (
                          <tr key={c.id}>
                            <td style={{ fontFamily: 'monospace' }}>{c.dni}</td>
                            <td style={{ fontWeight: 600 }}>{c.nombre} {c.apellido}</td>
                            <td>
                              <span className={`status-badge ${c.asiste ? 'asiste' : 'no-asiste'}`}>
                                {c.asiste ? 'ASISTE' : 'NO ASISTE'}
                              </span>
                            </td>
                            <td>{c.restricciones_alimentarias || '—'}</td>
                            <td title={c.comentarios}>{c.comentarios || '—'}</td>
                            <td>{c.fecha_respuesta ? `${c.fecha_respuesta} ${c.hora_respuesta ? c.hora_respuesta.substring(0,5) : ''}` : '—'}</td>
                            <td>
                              <div style={{ display: 'flex', gap: '0.25rem' }}>
                                <button className="admin-btn-action" onClick={() => setEditRsvp(c)} title="Editar">
                                  <Edit3 size={14} />
                                </button>
                                <button className="admin-btn-action delete" onClick={() => handleDeleteRsvp(c.id)} title="Eliminar">
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* DIALOGS AND EDIT POPUPS */}
      {/* ------------------------------------------------------------- */}

      {/* Edit RSVP Modal */}
      {editRsvp && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h3 className="modal-title font-sans">Editar Confirmación</h3>
              <button className="modal-close-btn" onClick={() => setEditRsvp(null)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleEditRsvpSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label required">Nombre</label>
                  <input type="text" className="form-input" value={editRsvp.nombre} onChange={(e) => setEditRsvp({ ...editRsvp, nombre: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label className="form-label required">Apellido</label>
                  <input type="text" className="form-input" value={editRsvp.apellido} onChange={(e) => setEditRsvp({ ...editRsvp, apellido: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label className="form-label required">DNI</label>
                  <input type="text" className="form-input" value={editRsvp.dni} onChange={(e) => setEditRsvp({ ...editRsvp, dni: e.target.value.replace(/\D/g, '') })} required />
                </div>
                <div className="form-group">
                  <label className="form-label required">¿Asiste?</label>
                  <select className="form-input" value={editRsvp.asiste ? 'true' : 'false'} onChange={(e) => setEditRsvp({ ...editRsvp, asiste: e.target.value === 'true' })}>
                    <option value="true">Sí, asiste</option>
                    <option value="false">No asiste</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Restricciones Alimentarias</label>
                  <input type="text" className="form-input" value={editRsvp.restricciones_alimentarias || ''} onChange={(e) => setEditRsvp({ ...editRsvp, restricciones_alimentarias: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Comentarios</label>
                  <textarea className="form-input" value={editRsvp.comentarios || ''} onChange={(e) => setEditRsvp({ ...editRsvp, comentarios: e.target.value })} style={{ minHeight: '60px' }} />
                </div>
              </div>
              <div className="admin-card-footer" style={{ padding: '1rem', display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-secondary" style={{ padding: '0.5rem 1rem' }} onClick={() => setEditRsvp(null)}>Cancelar</button>
                <button type="submit" className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>Guardar Cambios</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Suggested Song Modal */}
      {editSong && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h3 className="modal-title font-sans">Editar Canción</h3>
              <button className="modal-close-btn" onClick={() => setEditSong(null)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleEditSongSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label required">Invitado</label>
                  <input type="text" className="form-input" value={editSong.invitado} onChange={(e) => setEditSong({ ...editSong, invitado: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label className="form-label required">Nombre de Canción</label>
                  <input type="text" className="form-input" value={editSong.cancion} onChange={(e) => setEditSong({ ...editSong, cancion: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label className="form-label required">Artista</label>
                  <input type="text" className="form-input" value={editSong.artista} onChange={(e) => setEditSong({ ...editSong, artista: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Comentario</label>
                  <input type="text" className="form-input" value={editSong.comentario || ''} onChange={(e) => setEditSong({ ...editSong, comentario: e.target.value })} />
                </div>
              </div>
              <div className="admin-card-footer" style={{ padding: '1rem', display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-secondary" style={{ padding: '0.5rem 1rem' }} onClick={() => setEditSong(null)}>Cancelar</button>
                <button type="submit" className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>Guardar Cambios</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Publish Modal */}
      {confirmPublishOpen && (
        <div className="modal-overlay" style={{ zIndex: 11000 }}>
          <div className="modal-container" style={{ maxWidth: '380px' }}>
            <div className="modal-header" style={{ backgroundColor: '#fffbeb', borderBottomColor: '#fef3c7' }}>
              <h3 className="modal-title font-sans" style={{ color: '#b45309', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <AlertCircle size={20} /> Publicar Cambios
              </h3>
            </div>
            <div className="modal-body" style={{ textAlign: 'center', padding: '1.5rem' }}>
              <p style={{ fontSize: '0.95rem', color: '#374151', lineHeight: '1.5' }}>
                ¿Querés publicar estos cambios en la invitación? Todos los invitados verán la nueva información de inmediato.
              </p>
            </div>
            <div className="admin-card-footer" style={{ padding: '1rem', display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
              <button className="btn btn-secondary" style={{ padding: '0.5rem 1rem' }} onClick={() => setConfirmPublishOpen(false)}>
                Cancelar
              </button>
              <button className="btn btn-primary" style={{ padding: '0.5rem 1rem' }} onClick={handlePublish}>
                Confirmar y Publicar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification Box */}
      {toast && (
        <div className={`admin-alert-toast ${toast.type}`}>
          <Check size={18} />
          <span>{toast.message}</span>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 10. DEVICE PREVIEW MODE OVERLAY */}
      {/* ------------------------------------------------------------- */}
      {isPreview && (
        <div className="preview-modal-overlay">
          <header className="preview-modal-header">
            <div>
              <span style={{ fontSize: '1rem', fontWeight: 600 }}>Vista Previa (Borrador Activo)</span>
              <p style={{ fontSize: '0.7rem', color: '#9ca3af', margin: 0 }}>
                Estás viendo los cambios guardados como borrador.
              </p>
            </div>

            <div className="preview-modal-controls">
              <button 
                className={`preview-size-btn ${previewSize === 'mobile' ? 'active' : ''}`}
                onClick={() => setPreviewSize('mobile')}
                title="Vista Celular"
              >
                <Smartphone size={18} />
              </button>
              <button 
                className={`preview-size-btn ${previewSize === 'tablet' ? 'active' : ''}`}
                onClick={() => setPreviewSize('tablet')}
                title="Vista Tablet"
              >
                <Tablet size={18} />
              </button>
              <button 
                className={`preview-size-btn ${previewSize === 'desktop' ? 'active' : ''}`}
                onClick={() => setPreviewSize('desktop')}
                title="Vista Computadora"
              >
                <Monitor size={18} />
              </button>
            </div>

            <button 
              className="btn btn-secondary" 
              style={{ color: '#fff', borderColor: '#4b5563', padding: '0.4rem 1rem', fontSize: '0.75rem' }} 
              onClick={() => setIsPreview(false)}
            >
              Cerrar Vista Previa
            </button>
          </header>

          <div className="preview-modal-body">
            <div className={`preview-iframe-wrapper ${previewSize}`}>
              <div className="preview-iframe-placeholder">
                {/* Directly renders the Invitation inside the preview frame using context's isPreview=true */}
                <Invitation />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

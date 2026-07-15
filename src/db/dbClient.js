// -------------------------------------------------------------
// 1. SEED DATA FOR LOCALSTORAGE FALLBACK
// -------------------------------------------------------------
const DEFAULT_CONFIG = {
  general: {
    nombres_novios: 'Nestor y Pame',
    frase_amor: 'Hay momentos en la vida que son especiales por sí solos, pero compartirlos con las personas que queremos los hace inolvidables.',
    frase_visible: true
  },
  evento: {
    fecha: '2026-10-24',
    horario: '17:45',
    hora_finalizacion: '04:00',
    lugar: 'Las Moras Eventos',
    direccion: 'Mateo Blanco 369, Campana, Buenos Aires',
    maps_url: 'https://maps.google.com/?q=Las+Moras+Eventos+Mateo+Blanco+369+Campana',
    dress_code_tipo: 'Elegante',
    dress_code_texto: 'Queremos que te sientas cómodo y elegante para compartir esta noche con nosotros.',
    dress_code_colores: 'Por favor, reservar los colores blanco y bordo para los protagonistas y la ambientación.',
    dress_code_nota: 'No es necesario utilizar los colores de la invitación. Solo te pedimos evitar blanco y bordo.',
    calendario_titulo: 'Casamiento de Nestor y Pame',
    calendario_descripcion: '¡Acompañanos a celebrar nuestro casamiento!',
    ceremonia_fiesta_text: 'La ceremonia y la fiesta se realizarán en el mismo lugar. Luego de la ceremonia, continuaremos celebrando juntos.'
  },
  enlaces: {
    instagram_user: 'nestorypame2026',
    instagram_url: 'https://instagram.com/nestorypame2026',
    instagram_hashtag: '#NestoryPame',
    instagram_text: 'Seguinos en Instagram para compartir la previa del gran día.',
    instagram_visible: true,
    compartir_fotos_url: 'https://photos.google.com/',
    compartir_fotos_visible: true,
    sugerir_canciones_url: 'https://open.spotify.com/playlist/6v4DSTXLcXvtaqdUaNyQtI?si=DG0YFn4oRf-22BDSiOOg6Q&utm_source=copy-link&pt=f4c06ce707aaf929713334cb603cc729&pi=-s59dHP-RnWSc',
    sugerir_canciones_modalidad: 'externo',
    sugerir_canciones_visible: true
  },
  regalos: {
    visible: true,
    alias: 'casamiento.nestor.pame',
    titular: 'Nestor y Pame',
    banco: 'Banco Galicia',
    cbu_cvu: '0070000000000000000000',
    texto_regalos: 'El mejor regalo es compartir este momento con nosotros. Pero si además querés ayudarnos a cumplir nuestros próximos sueños, te dejamos nuestros datos.'
  },
  musica: {
    volumen_inicial: 0.5,
    loop: true
  }
};

const DEFAULT_PHOTOS = [
  {
    id: 'photo-1',
    state: 'published',
    tipo: 'portada',
    url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800',
    orden: 0,
    posicion_encuadre: 'center',
    texto_alternativo: 'Portada principal Nestor y Pame',
    visible: true
  }
];

const DEFAULT_CONFIRMATIONS = [
  {
    id: 'rsvp-1',
    nombre: 'Juan',
    apellido: 'Perez',
    dni: '11111111',
    asistencia: 'si',
    menores: 0,
    dieta: 'Ninguna',
    comentario: '¡Felicitaciones! Qué alegría acompañarlos.',
    fecha_creacion: new Date().toISOString()
  }
];

const DEFAULT_SONGS = [
  {
    id: 'song-1',
    invitado: 'Juan Perez',
    cancion: 'Get Lucky',
    artista: 'Daft Punk',
    comentario: 'Para mover los pies toda la noche',
    fecha_creacion: new Date().toISOString()
  }
];

const DEFAULT_HISTORY = [
  {
    id: 'hist-1',
    fecha: new Date().toISOString(),
    usuario: 'admin@nestorypame.com',
    accion: 'publicar_cambios',
    detalle: 'Inicialización de los datos del casamiento'
  }
];

// LocalStorage Initializer
const initLocalStorage = () => {
  if (!localStorage.getItem('np_config_draft')) {
    localStorage.setItem('np_config_draft', JSON.stringify(DEFAULT_CONFIG));
  }
  if (!localStorage.getItem('np_config_published')) {
    localStorage.setItem('np_config_published', JSON.stringify(DEFAULT_CONFIG));
  }
  if (!localStorage.getItem('np_photos')) {
    const photos = [
      ...DEFAULT_PHOTOS,
      ...DEFAULT_PHOTOS.map(p => ({ ...p, id: p.id + '-draft', state: 'draft' }))
    ];
    localStorage.setItem('np_photos', JSON.stringify(photos));
  }
  if (!localStorage.getItem('np_confirmations')) {
    localStorage.setItem('np_confirmations', JSON.stringify(DEFAULT_CONFIRMATIONS));
  }
  if (!localStorage.getItem('np_songs')) {
    localStorage.setItem('np_songs', JSON.stringify(DEFAULT_SONGS));
  }
  if (!localStorage.getItem('np_history')) {
    localStorage.setItem('np_history', JSON.stringify(DEFAULT_HISTORY));
  }
};

// Auto-run localStorage seed
initLocalStorage();

// Global fallback indicator
let fallbackActive = false;

// API Base URL for external hosting (e.g. Vercel connecting to a public API server)
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '';

// Helper: Performs a fetch call with auto-fallback to local storage
const apiCall = async (url, options = {}) => {
  if (fallbackActive) {
    throw new Error('FALLBACK_ACTIVE');
  }

  try {
    const res = await fetch(`${apiBaseUrl}${url}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    });

    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}));
      throw new Error(errBody.error || `HTTP error ${res.status}`);
    }

    return await res.json();
  } catch (err) {
    if (err.message === 'FALLBACK_ACTIVE') {
      throw err;
    }
    // Check if network error (server offline)
    if (err instanceof TypeError || err.message.includes('fetch')) {
      console.warn('API Server is offline. Switching to LocalStorage fallback mode.', err);
      fallbackActive = true;
      throw new Error('FALLBACK_ACTIVE');
    }
    throw err;
  }
};

// Helper: Deep copy helper for JSON structures
const clone = (obj) => JSON.parse(JSON.stringify(obj));

// -------------------------------------------------------------
// 2. EXPORTED DATABASE CLIENT INTERFACE
// -------------------------------------------------------------
export const dbClient = {
  
  // CONFIGURATIONS (Draft vs Published)
  config: {
    async get(state) {
      try {
        return await apiCall(`/api/config/${state}`);
      } catch (err) {
        initLocalStorage();
        const configStr = localStorage.getItem(`np_config_${state}`);
        return configStr ? JSON.parse(configStr) : clone(DEFAULT_CONFIG);
      }
    },

    async update(section, data) {
      try {
        const draft = await this.get('draft');
        draft[section] = { ...draft[section], ...data };
        return await apiCall('/api/config/draft', {
          method: 'POST',
          body: JSON.stringify(draft)
        });
      } catch (err) {
        initLocalStorage();
        const draft = JSON.parse(localStorage.getItem('np_config_draft'));
        if (draft[section]) {
          draft[section] = { ...draft[section], ...data };
          localStorage.setItem('np_config_draft', JSON.stringify(draft));
        }
      }
    },

    async publish(userEmail = 'admin@nestorypame.com') {
      try {
        return await apiCall('/api/config/publish', {
          method: 'POST',
          body: JSON.stringify({ userEmail })
        });
      } catch (err) {
        initLocalStorage();
        const draft = localStorage.getItem('np_config_draft');
        localStorage.setItem('np_config_published', draft);

        // Copy photos
        let photos = JSON.parse(localStorage.getItem('np_photos'));
        photos = photos.filter(p => p.state !== 'published');
        const draftPhotos = photos.filter(p => p.state === 'draft');
        const publishedPhotos = draftPhotos.map(p => ({
          ...p,
          id: p.id.replace('-draft', '') + '-' + Math.random().toString(36).substr(2, 9),
          state: 'published'
        }));
        localStorage.setItem('np_photos', JSON.stringify([...photos, ...publishedPhotos]));

        // Log history
        const history = JSON.parse(localStorage.getItem('np_history'));
        history.unshift({
          id: 'hist-' + Date.now(),
          fecha: new Date().toISOString(),
          usuario: userEmail,
          accion: 'publicar_cambios',
          detalle: 'Se publicaron los cambios del borrador al sitio público.'
        });
        localStorage.setItem('np_history', JSON.stringify(history));
      }
    }
  },

  // PHOTOGRAPHS
  photos: {
    async list(state) {
      try {
        return await apiCall(`/api/photos?state=${state}`);
      } catch (err) {
        initLocalStorage();
        const photos = JSON.parse(localStorage.getItem('np_photos'));
        return photos.filter(p => p.state === state).sort((a,b) => a.orden - b.orden);
      }
    },

    async add(state, photoData) {
      try {
        const photos = await this.list(state);
        const newPhoto = {
          id: Date.now(),
          ...photoData
        };
        photos.push(newPhoto);
        await apiCall(`/api/photos?state=${state}`, {
          method: 'POST',
          body: JSON.stringify(photos)
        });
        return newPhoto;
      } catch (err) {
        initLocalStorage();
        const photos = JSON.parse(localStorage.getItem('np_photos'));
        const newPhoto = {
          id: 'photo-' + Date.now() + (state === 'draft' ? '-draft' : ''),
          state,
          ...photoData
        };
        photos.push(newPhoto);
        localStorage.setItem('np_photos', JSON.stringify(photos));
        return newPhoto;
      }
    },

    async update(id, updates) {
      try {
        // Updates are made to the draft photos in the Admin Panel
        const photos = await this.list('draft');
        const updated = photos.map(p => p.id == id ? { ...p, ...updates } : p);
        await apiCall('/api/photos?state=draft', {
          method: 'POST',
          body: JSON.stringify(updated)
        });
      } catch (err) {
        initLocalStorage();
        const photos = JSON.parse(localStorage.getItem('np_photos'));
        const updated = photos.map(p => p.id === id ? { ...p, ...updates } : p);
        localStorage.setItem('np_photos', JSON.stringify(updated));
      }
    },

    async delete(id) {
      try {
        const photos = await this.list('draft');
        const filtered = photos.filter(p => p.id != id);
        await apiCall('/api/photos?state=draft', {
          method: 'POST',
          body: JSON.stringify(filtered)
        });
      } catch (err) {
        initLocalStorage();
        const photos = JSON.parse(localStorage.getItem('np_photos'));
        const filtered = photos.filter(p => p.id !== id);
        localStorage.setItem('np_photos', JSON.stringify(filtered));
      }
    }
  },

  // RSVPS (CONFIRMADOS)
  confirmations: {
    async list() {
      try {
        const data = await apiCall('/api/rsvps');
        return data.map(r => ({
          id: r.id,
          dni: r.dni,
          nombre: r.nombre,
          apellido: r.apellido,
          asiste: r.asistencia === 'si',
          menores: r.menores,
          restricciones_alimentarias: r.dieta || '',
          comentarios: r.comentario || '',
          fecha_creacion: r.fecha_creacion
        }));
      } catch (err) {
        initLocalStorage();
        return JSON.parse(localStorage.getItem('np_confirmations'));
      }
    },

    async add(rsvpData) {
      try {
        const payload = {
          dni: rsvpData.dni,
          nombre: rsvpData.nombre,
          apellido: rsvpData.apellido,
          asistencia: rsvpData.asiste ? 'si' : 'no',
          menores: rsvpData.menores || 0,
          dieta: rsvpData.restricciones_alimentarias || '',
          comentario: rsvpData.comentarios || ''
        };
        return await apiCall('/api/rsvps', {
          method: 'POST',
          body: JSON.stringify(payload)
        });
      } catch (err) {
        if (err.message === 'FALLBACK_ACTIVE') {
          initLocalStorage();
          const rsvps = JSON.parse(localStorage.getItem('np_confirmations'));
          
          // DNI check
          if (rsvps.some(r => r.dni === rsvpData.dni)) {
            throw new Error('Este DNI ya registró su confirmación de asistencia.');
          }

          const newRsvp = {
            id: 'rsvp-' + Date.now(),
            fecha_creacion: new Date().toISOString(),
            ...rsvpData
          };
          rsvps.push(newRsvp);
          localStorage.setItem('np_confirmations', JSON.stringify(rsvps));
          return newRsvp;
        }
        throw err;
      }
    },

    async update(id, updates) {
      try {
        const payload = {};
        if (updates.dni !== undefined) payload.dni = updates.dni;
        if (updates.nombre !== undefined) payload.nombre = updates.nombre;
        if (updates.apellido !== undefined) payload.apellido = updates.apellido;
        if (updates.asiste !== undefined) payload.asistencia = updates.asiste ? 'si' : 'no';
        if (updates.menores !== undefined) payload.menores = updates.menores;
        if (updates.restricciones_alimentarias !== undefined) payload.dieta = updates.restricciones_alimentarias;
        if (updates.comentarios !== undefined) payload.comentario = updates.comentarios;

        return await apiCall(`/api/rsvps/${id}`, {
          method: 'PUT',
          body: JSON.stringify(payload)
        });
      } catch (err) {
        initLocalStorage();
        const rsvps = JSON.parse(localStorage.getItem('np_confirmations'));
        
        if (updates.dni && rsvps.some(r => r.dni === updates.dni && r.id !== id)) {
          throw new Error('Otro invitado ya tiene registrado este DNI.');
        }

        const updated = rsvps.map(r => r.id === id ? { ...r, ...updates } : r);
        localStorage.setItem('np_confirmations', JSON.stringify(updated));
      }
    },

    async delete(id) {
      try {
        return await apiCall(`/api/rsvps/${id}`, {
          method: 'DELETE'
        });
      } catch (err) {
        initLocalStorage();
        const rsvps = JSON.parse(localStorage.getItem('np_confirmations'));
        const filtered = rsvps.filter(r => r.id !== id);
        localStorage.setItem('np_confirmations', JSON.stringify(filtered));
      }
    }
  },

  // SONGS
  songs: {
    async list() {
      try {
        return await apiCall('/api/songs');
      } catch (err) {
        initLocalStorage();
        return JSON.parse(localStorage.getItem('np_songs'));
      }
    },

    async add(songData) {
      try {
        return await apiCall('/api/songs', {
          method: 'POST',
          body: JSON.stringify(songData)
        });
      } catch (err) {
        initLocalStorage();
        const songs = JSON.parse(localStorage.getItem('np_songs'));
        const newSong = {
          id: 'song-' + Date.now(),
          fecha_creacion: new Date().toISOString(),
          ...songData
        };
        songs.push(newSong);
        localStorage.setItem('np_songs', JSON.stringify(songs));
        return newSong;
      }
    },

    async delete(id) {
      try {
        return await apiCall(`/api/songs/${id}`, {
          method: 'DELETE'
        });
      } catch (err) {
        initLocalStorage();
        const songs = JSON.parse(localStorage.getItem('np_songs'));
        const filtered = songs.filter(s => s.id !== id);
        localStorage.setItem('np_songs', JSON.stringify(filtered));
      }
    }
  },

  // LOGS (HISTORIAL)
  logs: {
    async list() {
      try {
        return await apiCall('/api/logs');
      } catch (err) {
        initLocalStorage();
        return JSON.parse(localStorage.getItem('np_history'));
      }
    }
  },

  // ASSETS UPLOADS (Base64 conversion)
  assets: {
    async uploadPhoto(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = (err) => reject(err);
        reader.readAsDataURL(file);
      });
    },

    async uploadMusic(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = (err) => reject(err);
        reader.readAsDataURL(file);
      });
    }
  },

  // AUTHENTICATION
  auth: {
    async login(email, password) {
      try {
        const data = await apiCall('/api/auth/login', {
          method: 'POST',
          body: JSON.stringify({ email, password })
        });
        localStorage.setItem('np_session_active', JSON.stringify(data.user));
        return data.user;
      } catch (err) {
        if (err.message === 'FALLBACK_ACTIVE') {
          if (email === 'admin@nestorypame.com' && password === 'nestorypame2026') {
            const mockUser = { email, id: 'admin-id' };
            localStorage.setItem('np_session_active', JSON.stringify(mockUser));
            return mockUser;
          }
          throw new Error('Credenciales incorrectas (Modo Desconectado).');
        }
        throw err;
      }
    },

    async logout() {
      localStorage.removeItem('np_session_active');
    },

    async getUser() {
      const userStr = localStorage.getItem('np_session_active');
      return userStr ? JSON.parse(userStr) : null;
    }
  }
};

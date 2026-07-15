import { createClient } from '@supabase/supabase-js';

// Environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

let supabase = null;
let useMock = true;

if (supabaseUrl && supabaseAnonKey && supabaseUrl !== 'YOUR_SUPABASE_URL') {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
    useMock = false;
    console.log('Database client: Supabase connected successfully.');
  } catch (err) {
    console.warn('Database client: Failed to initialize Supabase, falling back to LocalStorage mock.', err);
    useMock = true;
  }
} else {
  console.log('Database client: Using LocalStorage mock. (Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env to connect to cloud)');
}

// -------------------------------------------------------------
// 1. SEED DATA FOR LOCALSTORAGE MOCK
// -------------------------------------------------------------
const DEFAULT_CONFIG = {
  general: {
    nombres_novios: 'Nestor y Pame',
    welcome_text: 'Bienvenidos a nuestra invitación',
    fecha_limite_confirmacion: '2026-10-15T23:59:59-03:00'
  },
  evento: {
    fecha: '2026-10-24',
    horario: '17:45',
    zona_horaria: 'America/Argentina/Buenos_Aires',
    lugar: 'Las Moras Eventos',
    direccion: 'Mateo Blanco 369, Campana, Buenos Aires',
    maps_url: 'https://maps.google.com/?q=Las+Moras+Eventos+Mateo+Blanco+369+Campana',
    hora_finalizacion: '04:00',
    ceremonia_fiesta_text: 'La ceremonia y la fiesta se realizarán en el mismo lugar. Luego de la ceremonia, continuaremos celebrando juntos.',
    calendario_titulo: 'Casamiento de Nestor y Pame',
    calendario_descripcion: '¡Acompañanos a celebrar nuestro casamiento!'
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
    sugerir_canciones_modalidad: 'externo', // 'interno' o 'externo'
    sugerir_canciones_visible: true
  },
  regalos: {
    alias: 'casamiento.nestor.pame',
    titular: 'Nestor y Pame',
    banco: 'Banco Galicia',
    cbu_cvu: '0070000000000000000000',
    texto_regalos: 'El mejor regalo es compartir este momento con nosotros. Pero si además querés ayudarnos a cumplir nuestros próximos sueños, te dejamos nuestros datos bancarios.',
    visible: true
  },
  musica: {
    cancion_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    cancion_nombre: 'Nuestra Canción',
    artista: 'Artista Favorito',
    volumen_inicial: 0.5,
    visible: true,
    loop: true,
    autoplay_welcome: true
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
  },
  {
    id: 'photo-2',
    state: 'published',
    tipo: 'galeria',
    url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=600',
    orden: 0,
    posicion_encuadre: 'center',
    texto_alternativo: 'Nestor y Pame caminando juntos',
    visible: true
  },
  {
    id: 'photo-3',
    state: 'published',
    tipo: 'galeria',
    url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=600',
    orden: 1,
    posicion_encuadre: 'center',
    texto_alternativo: 'Sonrisas compartidas',
    visible: true
  },
  {
    id: 'photo-4',
    state: 'published',
    tipo: 'galeria',
    url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=600',
    orden: 2,
    posicion_encuadre: 'center',
    texto_alternativo: 'Un momento especial',
    visible: true
  },
  {
    id: 'photo-5',
    state: 'published',
    tipo: 'galeria',
    url: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&q=80&w=600',
    orden: 3,
    posicion_encuadre: 'center',
    texto_alternativo: 'Nuestras manos',
    visible: true
  },
  {
    id: 'photo-6',
    state: 'published',
    tipo: 'galeria',
    url: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&q=80&w=600',
    orden: 4,
    posicion_encuadre: 'center',
    texto_alternativo: 'Celebrando el amor',
    visible: true
  }
];

const DEFAULT_CONFIRMATIONS = [
  {
    id: 'rsvp-1',
    nombre: 'Juan',
    apellido: 'Perez',
    dni: '11111111',
    asiste: true,
    restricciones_alimentarias: 'Ninguna',
    comentarios: '¡Felicitaciones! Qué alegría acompañarlos.',
    fecha_respuesta: '2026-07-10',
    hora_respuesta: '12:30:00'
  },
  {
    id: 'rsvp-2',
    nombre: 'Maria',
    apellido: 'Gomez',
    dni: '22222222',
    asiste: true,
    restricciones_alimentarias: 'Celíaca',
    comentarios: '',
    fecha_respuesta: '2026-07-10',
    hora_respuesta: '14:15:00'
  },
  {
    id: 'rsvp-3',
    nombre: 'Carlos',
    apellido: 'Lopez',
    dni: '33333333',
    asiste: false,
    restricciones_alimentarias: '',
    comentarios: 'Lamentablemente no puedo ir por un viaje familiar. ¡Los felicito!',
    fecha_respuesta: '2026-07-10',
    hora_respuesta: '16:45:00'
  }
];

const DEFAULT_SONGS = [
  {
    id: 'song-1',
    invitado: 'Juan Perez',
    cancion: 'Get Lucky',
    artista: 'Daft Punk',
    comentario: 'Para mover los pies toda la noche',
    fecha: '2026-07-10T15:30:00Z',
    estado: 'nueva'
  },
  {
    id: 'song-2',
    invitado: 'Maria Gomez',
    cancion: 'Perfect',
    artista: 'Ed Sheeran',
    comentario: 'Un lento romántico',
    fecha: '2026-07-10T16:00:00Z',
    estado: 'seleccionada'
  }
];

const DEFAULT_HISTORY = [
  {
    id: 'hist-1',
    fecha_modificacion: '2026-07-10T17:00:00-03:00',
    fecha_publicacion: '2026-07-10T17:05:00-03:00',
    usuario: 'admin@nestorypame.com',
    descripcion: 'Inicialización de los datos del casamiento'
  }
];

// Initialize localStorage if empty
const initLocalStorage = () => {
  const existingDraft = localStorage.getItem('np_config_draft');
  const needsDraftReset = !existingDraft || !JSON.parse(existingDraft).enlaces.sugerir_canciones_url;
  
  if (needsDraftReset) {
    localStorage.setItem('np_config_draft', JSON.stringify(DEFAULT_CONFIG));
  }
  
  const existingPublished = localStorage.getItem('np_config_published');
  const needsPublishedReset = !existingPublished || !JSON.parse(existingPublished).enlaces.sugerir_canciones_url;
  
  if (needsPublishedReset) {
    localStorage.setItem('np_config_published', JSON.stringify(DEFAULT_CONFIG));
  }
  if (!localStorage.getItem('np_photos')) {
    // Both draft and published photos
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
  if (!localStorage.getItem('np_user')) {
    // Default admin mock session
    localStorage.setItem('np_admin_user', JSON.stringify({ email: 'admin@nestorypame.com' }));
  }
};

if (useMock) {
  initLocalStorage();
}

// Helper: Deep copy helper for JSON structures
const clone = (obj) => JSON.parse(JSON.stringify(obj));

// Helper: Formats Date & Time for responses
const getCurrentDateStr = () => {
  const d = new Date();
  return d.toISOString().split('T')[0];
};

const getCurrentTimeStr = () => {
  const d = new Date();
  const h = String(d.getHours()).padStart(2, '0');
  const m = String(d.getMinutes()).padStart(2, '0');
  const s = String(d.getSeconds()).padStart(2, '0');
  return `${h}:${m}:${s}`;
};

// -------------------------------------------------------------
// 2. EXPORTED DATABASE CLIENT INTERFACE
// -------------------------------------------------------------
export const dbClient = {
  // CONFIGURATIONS (Draft vs Published)
  config: {
    /**
     * Get entire configuration for state: 'draft' or 'published'
     */
    async get(state) {
      if (!useMock) {
        // Query database sections
        const results = await Promise.all([
          supabase.from('configuracion_general').select('*').eq('id', state).single(),
          supabase.from('evento').select('*').eq('id', state).single(),
          supabase.from('enlaces').select('*').eq('id', state).single(),
          supabase.from('regalos').select('*').eq('id', state).single(),
          supabase.from('musica').select('*').eq('id', state).single(),
        ]);

        const errors = results.filter(r => r.error);
        if (errors.length > 0) {
          console.error('Supabase get config error:', errors);
          // If query fails, fall back to mock
        } else {
          return {
            general: results[0].data,
            evento: results[1].data,
            enlaces: results[2].data,
            regalos: results[3].data,
            musica: results[4].data,
          };
        }
      }

      // Mock
      initLocalStorage();
      const configStr = localStorage.getItem(`np_config_${state}`);
      return configStr ? JSON.parse(configStr) : clone(DEFAULT_CONFIG);
    },

    /**
     * Update a single section of the 'draft' configuration
     */
    async update(section, data) {
      if (!useMock) {
        const { error } = await supabase
          .from(
            section === 'general' ? 'configuracion_general' 
            : section === 'evento' ? 'evento'
            : section === 'enlaces' ? 'enlaces'
            : section === 'regalos' ? 'regalos'
            : 'musica'
          )
          .update(data)
          .eq('id', 'draft');

        if (error) throw error;
        return;
      }

      // Mock
      initLocalStorage();
      const draft = JSON.parse(localStorage.getItem('np_config_draft'));
      if (draft[section]) {
        draft[section] = { ...draft[section], ...data };
        localStorage.setItem('np_config_draft', JSON.stringify(draft));
      }
    },

    /**
     * Publish draft configuration: Copy entire 'draft' config to 'published'
     */
    async publish(userEmail = 'admin@nestorypame.com') {
      if (!useMock) {
        const draftConfig = await this.get('draft');
        
        // Copy rows from 'draft' to 'published'
        await Promise.all([
          supabase.from('configuracion_general').update({ ...draftConfig.general, id: 'published', updated_by: userEmail, updated_at: new Date() }).eq('id', 'published'),
          supabase.from('evento').update({ ...draftConfig.evento, id: 'published' }).eq('id', 'published'),
          supabase.from('enlaces').update({ ...draftConfig.enlaces, id: 'published' }).eq('id', 'published'),
          supabase.from('regalos').update({ ...draftConfig.regalos, id: 'published' }).eq('id', 'published'),
          supabase.from('musica').update({ ...draftConfig.musica, id: 'published' }).eq('id', 'published'),
        ]);

        // Publish draft photos: Delete published, and duplicate draft items into published state
        const { data: draftPhotos } = await supabase.from('fotografias').select('*').eq('state', 'draft');
        await supabase.from('fotografias').delete().eq('state', 'published');
        if (draftPhotos && draftPhotos.length > 0) {
          const publishedPhotos = draftPhotos.map(p => ({
            ...p,
            id: undefined, // Let db generate a new UUID
            state: 'published'
          }));
          await supabase.from('fotografias').insert(publishedPhotos);
        }

        // Add history entry
        await supabase.from('historial_cambios').insert({
          fecha_modificacion: new Date(),
          fecha_publicacion: new Date(),
          usuario: userEmail,
          descripcion: 'Publicación de cambios en la invitación'
        });

        return;
      }

      // Mock
      initLocalStorage();
      const draft = localStorage.getItem('np_config_draft');
      localStorage.setItem('np_config_published', draft);

      // Publish photos
      let photos = JSON.parse(localStorage.getItem('np_photos'));
      // Remove current published photos
      photos = photos.filter(p => p.state !== 'published');
      // Duplicate draft photos as published
      const draftPhotos = photos.filter(p => p.state === 'draft');
      const publishedPhotos = draftPhotos.map(p => ({
        ...p,
        id: p.id.replace('-draft', '') + '-' + Math.random().toString(36).substr(2, 9),
        state: 'published'
      }));
      localStorage.setItem('np_photos', JSON.stringify([...photos, ...publishedPhotos]));

      // Log History
      const history = JSON.parse(localStorage.getItem('np_history'));
      history.unshift({
        id: 'hist-' + Date.now(),
        fecha_modificacion: new Date().toISOString(),
        fecha_publicacion: new Date().toISOString(),
        usuario: userEmail,
        descripcion: 'Publicación de cambios en la invitación'
      });
      localStorage.setItem('np_history', JSON.stringify(history));
    }
  },

  // PHOTOGRAPHS
  photos: {
    async list(state) {
      if (!useMock) {
        const { data, error } = await supabase
          .from('fotografias')
          .select('*')
          .eq('state', state)
          .order('orden', { ascending: true });
        if (error) throw error;
        return data;
      }

      // Mock
      initLocalStorage();
      const photos = JSON.parse(localStorage.getItem('np_photos'));
      return photos.filter(p => p.state === state).sort((a,b) => a.orden - b.orden);
    },

    async add(state, photoData) {
      // photoData = { url, tipo, orden, posicion_encuadre, texto_alternativo, visible }
      if (!useMock) {
        const { data, error } = await supabase
          .from('fotografias')
          .insert({ ...photoData, state })
          .select()
          .single();
        if (error) throw error;
        return data;
      }

      // Mock
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
    },

    async update(id, updates) {
      if (!useMock) {
        const { data, error } = await supabase
          .from('fotografias')
          .update(updates)
          .eq('id', id)
          .select()
          .single();
        if (error) throw error;
        return data;
      }

      // Mock
      initLocalStorage();
      const photos = JSON.parse(localStorage.getItem('np_photos'));
      const idx = photos.findIndex(p => p.id === id);
      if (idx !== -1) {
        photos[idx] = { ...photos[idx], ...updates };
        localStorage.setItem('np_photos', JSON.stringify(photos));
        return photos[idx];
      }
      throw new Error('Photo not found');
    },

    async delete(id) {
      if (!useMock) {
        const { error } = await supabase
          .from('fotografias')
          .delete()
          .eq('id', id);
        if (error) throw error;
        return;
      }

      // Mock
      initLocalStorage();
      let photos = JSON.parse(localStorage.getItem('np_photos'));
      photos = photos.filter(p => p.id !== id);
      localStorage.setItem('np_photos', JSON.stringify(photos));
    },

    async reorder(state, reorderedList) {
      // reorderedList is list of { id, orden }
      if (!useMock) {
        // Bulk updates on Supabase. We can perform updates in parallel
        await Promise.all(reorderedList.map(item => 
          supabase.from('fotografias').update({ orden: item.orden }).eq('id', item.id)
        ));
        return;
      }

      // Mock
      initLocalStorage();
      const photos = JSON.parse(localStorage.getItem('np_photos'));
      reorderedList.forEach(item => {
        const photo = photos.find(p => p.id === item.id);
        if (photo) {
          photo.orden = item.orden;
        }
      });
      localStorage.setItem('np_photos', JSON.stringify(photos));
    }
  },

  // RSVPS (CONFIRMATIONS)
  confirmations: {
    async list() {
      if (!useMock) {
        const { data, error } = await supabase
          .from('confirmaciones')
          .select('*')
          .order('fecha_respuesta', { ascending: false })
          .order('hora_respuesta', { ascending: false });
        if (error) throw error;
        return data;
      }

      // Mock
      initLocalStorage();
      return JSON.parse(localStorage.getItem('np_confirmations'));
    },

    async add(rsvpData) {
      // Validate unique DNI
      const cleanDni = rsvpData.dni.replace(/\D/g, ''); // Numbers only
      if (!cleanDni) {
        throw new Error('El DNI es obligatorio y debe contener solo números.');
      }
      
      const rsvpToInsert = {
        ...rsvpData,
        dni: cleanDni,
        fecha_respuesta: getCurrentDateStr(),
        hora_respuesta: getCurrentTimeStr()
      };

      if (!useMock) {
        // Check duplicate
        const { data: existing } = await supabase
          .from('confirmaciones')
          .select('id')
          .eq('dni', cleanDni)
          .maybeSingle();
        
        if (existing) {
          throw new Error('Este DNI ya registra una confirmación previa.');
        }

        const { data, error } = await supabase
          .from('confirmaciones')
          .insert(rsvpToInsert)
          .select()
          .single();
        if (error) throw error;
        return data;
      }

      // Mock
      initLocalStorage();
      const confirmations = JSON.parse(localStorage.getItem('np_confirmations'));
      const duplicate = confirmations.find(c => c.dni === cleanDni);
      if (duplicate) {
        throw new Error('Este DNI ya registra una confirmación previa.');
      }

      const newRsvp = {
        id: 'rsvp-' + Date.now(),
        ...rsvpToInsert
      };
      confirmations.unshift(newRsvp);
      localStorage.setItem('np_confirmations', JSON.stringify(confirmations));
      return newRsvp;
    },

    async update(id, updates) {
      if (!useMock) {
        const { data, error } = await supabase
          .from('confirmaciones')
          .update(updates)
          .eq('id', id)
          .select()
          .single();
        if (error) throw error;
        return data;
      }

      // Mock
      initLocalStorage();
      const confirmations = JSON.parse(localStorage.getItem('np_confirmations'));
      const idx = confirmations.findIndex(c => c.id === id);
      if (idx !== -1) {
        confirmations[idx] = { ...confirmations[idx], ...updates };
        localStorage.setItem('np_confirmations', JSON.stringify(confirmations));
        return confirmations[idx];
      }
      throw new Error('RSVP not found');
    },

    async delete(id) {
      if (!useMock) {
        const { error } = await supabase
          .from('confirmaciones')
          .delete()
          .eq('id', id);
        if (error) throw error;
        return;
      }

      // Mock
      initLocalStorage();
      let confirmations = JSON.parse(localStorage.getItem('np_confirmations'));
      confirmations = confirmations.filter(c => c.id !== id);
      localStorage.setItem('np_confirmations', JSON.stringify(confirmations));
    }
  },

  // SONGS
  songs: {
    async list() {
      if (!useMock) {
        const { data, error } = await supabase
          .from('canciones_sugeridas')
          .select('*')
          .order('fecha', { ascending: false });
        if (error) throw error;
        return data;
      }

      // Mock
      initLocalStorage();
      return JSON.parse(localStorage.getItem('np_songs'));
    },

    async add(songData) {
      const songToInsert = {
        ...songData,
        fecha: new Date().toISOString(),
        estado: 'nueva'
      };

      if (!useMock) {
        const { data, error } = await supabase
          .from('canciones_sugeridas')
          .insert(songToInsert)
          .select()
          .single();
        if (error) throw error;
        return data;
      }

      // Mock
      initLocalStorage();
      const songs = JSON.parse(localStorage.getItem('np_songs'));
      const newSong = {
        id: 'song-' + Date.now(),
        ...songToInsert
      };
      songs.unshift(newSong);
      localStorage.setItem('np_songs', JSON.stringify(songs));
      return newSong;
    },

    async update(id, updates) {
      if (!useMock) {
        const { data, error } = await supabase
          .from('canciones_sugeridas')
          .update(updates)
          .eq('id', id)
          .select()
          .single();
        if (error) throw error;
        return data;
      }

      // Mock
      initLocalStorage();
      const songs = JSON.parse(localStorage.getItem('np_songs'));
      const idx = songs.findIndex(s => s.id === id);
      if (idx !== -1) {
        songs[idx] = { ...songs[idx], ...updates };
        localStorage.setItem('np_songs', JSON.stringify(songs));
        return songs[idx];
      }
      throw new Error('Song suggestion not found');
    },

    async delete(id) {
      if (!useMock) {
        const { error } = await supabase
          .from('canciones_sugeridas')
          .delete()
          .eq('id', id);
        if (error) throw error;
        return;
      }

      // Mock
      initLocalStorage();
      let songs = JSON.parse(localStorage.getItem('np_songs'));
      songs = songs.filter(s => s.id !== id);
      localStorage.setItem('np_songs', JSON.stringify(songs));
    }
  },

  // LOG HISTORIAL
  history: {
    async list() {
      if (!useMock) {
        const { data, error } = await supabase
          .from('historial_cambios')
          .select('*')
          .order('fecha_modificacion', { ascending: false });
        if (error) throw error;
        return data;
      }

      // Mock
      initLocalStorage();
      return JSON.parse(localStorage.getItem('np_history'));
    }
  },

  // STORAGE (Subida de fotos / música)
  storage: {
    async uploadPhoto(file) {
      if (!useMock) {
        // Generate a random name to prevent naming collision
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
        const filePath = `gallery/${fileName}`;

        // Upload to bucket 'invitation-assets' (needs to exist on Supabase dashboard)
        const { error: uploadError } = await supabase.storage
          .from('invitation-assets')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        // Get public URL
        const { data } = supabase.storage
          .from('invitation-assets')
          .getPublicUrl(filePath);

        return data.publicUrl;
      }

      // Mock: Convert to data URL to make it visual
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = (err) => reject(err);
        reader.readAsDataURL(file);
      });
    },

    async uploadMusic(file) {
      if (!useMock) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
        const filePath = `music/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('invitation-assets')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
          .from('invitation-assets')
          .getPublicUrl(filePath);

        return data.publicUrl;
      }

      // Mock: Convert to URL
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
      if (!useMock) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (error) throw error;
        return data.user;
      }

      // Mock login
      if (email === 'admin@nestorypame.com' && password === 'nestorypame2026') {
        const mockUser = { email, id: 'admin-id' };
        localStorage.setItem('np_session_active', JSON.stringify(mockUser));
        return mockUser;
      } else {
        throw new Error('Credenciales incorrectas. Intentá con admin@nestorypame.com / nestorypame2026');
      }
    },

    async logout() {
      if (!useMock) {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        return;
      }

      // Mock logout
      localStorage.removeItem('np_session_active');
    },

    async getUser() {
      if (!useMock) {
        const { data: { user } } = await supabase.auth.getUser();
        return user;
      }

      // Mock session get
      const userStr = localStorage.getItem('np_session_active');
      return userStr ? JSON.parse(userStr) : null;
    }
  }
};

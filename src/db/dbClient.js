import { createClient } from '@supabase/supabase-js';

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
    loop: true,
    cancion_nombre: 'Te conocí',
    artista: 'Zenar y Dario Coiro',
    cancion_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
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
  if (!localStorage.getItem('np_messages')) {
    localStorage.setItem('np_messages', JSON.stringify([]));
  }
};

// Auto-run localStorage seed
initLocalStorage();

// Supabase Client Setup
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
    console.warn('Database client: Failed to initialize Supabase, falling back to LocalStorage.', err);
    useMock = true;
  }
} else {
  console.log('Database client: Using LocalStorage fallback (Supabase credentials not configured).');
}

// Helper: Deep copy helper
const clone = (obj) => JSON.parse(JSON.stringify(obj));

// -------------------------------------------------------------
// 2. EXPORTED DATABASE CLIENT INTERFACE (SUPABASE + LOCALSTORAGE FALLBACK)
// -------------------------------------------------------------
export const dbClient = {

  // CONFIGURATIONS (Draft vs Published)
  config: {
    async get(state) {
      if (!useMock) {
        try {
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
          } else {
            return {
              general: results[0].data,
              evento: results[1].data,
              enlaces: results[2].data,
              regalos: results[3].data,
              musica: results[4].data,
            };
          }
        } catch (err) {
          console.error('Failed to get config from Supabase, falling back:', err);
        }
      }

      initLocalStorage();
      const configStr = localStorage.getItem(`np_config_${state}`);
      return configStr ? JSON.parse(configStr) : clone(DEFAULT_CONFIG);
    },

    async update(section, data) {
      if (!useMock) {
        try {
          const table = section === 'general' ? 'configuracion_general'
                      : section === 'evento' ? 'evento'
                      : section === 'enlaces' ? 'enlaces'
                      : section === 'regalos' ? 'regalos'
                      : 'musica';
          
          const { error } = await supabase
            .from(table)
            .update(data)
            .eq('id', 'draft');

          if (error) throw error;
          return;
        } catch (err) {
          console.error('Failed to update config on Supabase:', err);
        }
      }

      initLocalStorage();
      const draft = JSON.parse(localStorage.getItem('np_config_draft') || '{}');
      if (draft[section]) {
        draft[section] = { ...draft[section], ...data };
        localStorage.setItem('np_config_draft', JSON.stringify(draft));
      }
    },

    async publish(userEmail = 'admin@nestorypame.com') {
      if (!useMock) {
        try {
          const draftConfig = await this.get('draft');
          
          // Copy rows from 'draft' to 'published'
          const results = await Promise.all([
            supabase.from('configuracion_general').update({ ...draftConfig.general, id: 'published', updated_by: userEmail, updated_at: new Date() }).eq('id', 'published'),
            supabase.from('evento').update({ ...draftConfig.evento, id: 'published' }).eq('id', 'published'),
            supabase.from('enlaces').update({ ...draftConfig.enlaces, id: 'published' }).eq('id', 'published'),
            supabase.from('regalos').update({ ...draftConfig.regalos, id: 'published' }).eq('id', 'published'),
            supabase.from('musica').update({ ...draftConfig.musica, id: 'published' }).eq('id', 'published'),
          ]);

          const errors = results.filter(r => r.error);
          if (errors.length > 0) throw new Error(errors[0].error.message);

          // Publish draft photos: Delete published, and duplicate draft items into published state
          const { data: draftPhotos, error: getPhotosError } = await supabase.from('fotografias').select('*').eq('state', 'draft');
          if (getPhotosError) throw getPhotosError;

          await supabase.from('fotografias').delete().eq('state', 'published');
          if (draftPhotos && draftPhotos.length > 0) {
            const publishedPhotos = draftPhotos.map(p => ({
              ...p,
              id: undefined, // Let DB generate new IDs
              state: 'published'
            }));
            const { error: insertPhotosError } = await supabase.from('fotografias').insert(publishedPhotos);
            if (insertPhotosError) throw insertPhotosError;
          }

          // Add history entry
          await supabase.from('historial_cambios').insert({
            fecha_modificacion: new Date(),
            usuario: userEmail,
            accion: 'publicar_cambios',
            detalle: 'Se publicaron los cambios del borrador al sitio público.'
          });

          return;
        } catch (err) {
          console.error('Failed to publish changes to Supabase:', err);
        }
      }

      initLocalStorage();
      const draft = localStorage.getItem('np_config_draft');
      localStorage.setItem('np_config_published', draft);
      
      const photos = JSON.parse(localStorage.getItem('np_photos') || '[]');
      const filtered = photos.filter(p => p.state !== 'published');
      const drafts = photos.filter(p => p.state === 'draft');
      drafts.forEach(p => {
        filtered.push({
          ...p,
          id: 'photo-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5),
          state: 'published'
        });
      });
      localStorage.setItem('np_photos', JSON.stringify(filtered));

      // Local history log
      const history = JSON.parse(localStorage.getItem('np_history') || '[]');
      history.unshift({
        id: 'hist-' + Date.now(),
        fecha: new Date().toISOString(),
        usuario: userEmail,
        accion: 'publicar_cambios',
        detalle: 'Se publicaron los cambios del borrador al sitio público (LocalStorage)'
      });
      localStorage.setItem('np_history', JSON.stringify(history));
    }
  },

  // PHOTOS (GALLERY & COVERS)
  photos: {
    async list(state) {
      if (!useMock) {
        try {
          const { data, error } = await supabase
            .from('fotografias')
            .select('*')
            .eq('state', state)
            .order('orden', { ascending: true });
          if (error) throw error;
          return data;
        } catch (err) {
          console.error('Failed to list photos from Supabase:', err);
        }
      }

      initLocalStorage();
      const photos = JSON.parse(localStorage.getItem('np_photos') || '[]');
      return photos.filter(p => p.state === state).sort((a,b) => a.orden - b.orden);
    },

    async add(state, photoData) {
      if (!useMock) {
        try {
          const { data, error } = await supabase
            .from('fotografias')
            .insert({ ...photoData, state })
            .select()
            .single();
          if (error) throw error;
          return data;
        } catch (err) {
          console.error('Failed to add photo to Supabase:', err);
        }
      }

      initLocalStorage();
      const photos = JSON.parse(localStorage.getItem('np_photos') || '[]');
      const newPhoto = {
        id: 'photo-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5),
        state,
        ...photoData
      };
      photos.push(newPhoto);
      localStorage.setItem('np_photos', JSON.stringify(photos));
      return newPhoto;
    },

    async update(id, updates) {
      if (!useMock) {
        try {
          const { data, error } = await supabase
            .from('fotografias')
            .update(updates)
            .eq('id', id)
            .select()
            .single();
          if (error) throw error;
          return data;
        } catch (err) {
          console.error('Failed to update photo on Supabase:', err);
        }
      }

      initLocalStorage();
      const photos = JSON.parse(localStorage.getItem('np_photos') || '[]');
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
        try {
          const { error } = await supabase
            .from('fotografias')
            .delete()
            .eq('id', id);
          if (error) throw error;
          return;
        } catch (err) {
          console.error('Failed to delete photo from Supabase:', err);
        }
      }

      initLocalStorage();
      let photos = JSON.parse(localStorage.getItem('np_photos') || '[]');
      photos = photos.filter(p => p.id !== id);
      localStorage.setItem('np_photos', JSON.stringify(photos));
    }
  },

  // RSVPS (CONFIRMATIONS)
  confirmations: {
    async list() {
      if (!useMock) {
        try {
          const { data, error } = await supabase
            .from('confirmaciones')
            .select('*')
            .order('fecha_respuesta', { ascending: false });
          if (error) throw error;
          
          return data.map(r => ({
            id: r.id,
            dni: r.dni,
            nombre: r.nombre,
            apellido: r.apellido,
            asiste: r.asiste,
            menores: r.menores || 0,
            restricciones_alimentarias: r.restricciones_alimentarias || '',
            comentarios: r.comentarios || '',
            fecha_creacion: r.fecha_respuesta
          }));
        } catch (err) {
          console.error('Failed to list RSVPs from Supabase:', err);
        }
      }

      initLocalStorage();
      return JSON.parse(localStorage.getItem('np_confirmations') || '[]');
    },

    async syncToGoogleSheets(guests) {
      try {
        const config = await dbClient.config.get('published');
        const sheetsUrl = config.enlaces?.google_sheets_url;
        if (!sheetsUrl) {
          console.log('Google Sheets sync URL not configured. Skipping.');
          return;
        }

        const payload = {
          invitados: guests.map(g => ({
            nombre: g.nombre,
            apellido: g.apellido,
            dni: g.dni,
            asistencia: g.asiste ? 'Sí' : 'No',
            dieta: g.restricciones_alimentarias || 'Ninguna',
            comentario: g.comentarios || ''
          }))
        };

        const res = await fetch(sheetsUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const result = await res.json();
        console.log('Frontend Sheets Sync successful:', result);
      } catch (e) {
        console.warn('Frontend Sheets Sync failed:', e.message);
      }
    },

    async add(rsvpData) {
      const isArray = Array.isArray(rsvpData);
      const dataList = isArray ? rsvpData : [rsvpData];

      if (!useMock) {
        try {
          // Check for duplicate DNIs
          for (const g of dataList) {
            const { data: existing } = await supabase
              .from('confirmaciones')
              .select('id')
              .eq('dni', g.dni)
              .maybeSingle();
            if (existing) {
              throw new Error(`El DNI ${g.dni} (${g.nombre} ${g.apellido}) ya registró su confirmación.`);
            }
          }

          const payload = dataList.map(g => ({
            dni: g.dni.replace(/\D/g, ''),
            nombre: g.nombre,
            apellido: g.apellido,
            asiste: g.asiste,
            menores: g.menores || 0,
            restricciones_alimentarias: g.restricciones_alimentarias || '',
            comentarios: g.comentarios || '',
            fecha_respuesta: new Date().toISOString()
          }));

          const { data, error } = await supabase
            .from('confirmaciones')
            .insert(payload)
            .select();
          
          if (error) throw error;

          // Perform background Google Sheets sync from frontend
          this.syncToGoogleSheets(dataList);

          return isArray ? data : data[0];
        } catch (err) {
          console.error('Failed to add confirmation to Supabase:', err);
          throw err;
        }
      }

      // LocalStorage Fallback
      initLocalStorage();
      const rsvps = JSON.parse(localStorage.getItem('np_confirmations') || '[]');
      
      for (const g of dataList) {
        if (rsvps.some(r => r.dni === g.dni)) {
          throw new Error(`El DNI ${g.dni} (${g.nombre} ${g.apellido}) ya registró su confirmación.`);
        }
      }

      const insertedList = [];
      for (const g of dataList) {
        const newRsvp = {
          id: 'rsvp-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5),
          fecha_creacion: new Date().toISOString(),
          ...g
        };
        rsvps.push(newRsvp);
        insertedList.push(newRsvp);
      }

      localStorage.setItem('np_confirmations', JSON.stringify(rsvps));
      
      this.syncToGoogleSheets(dataList);

      return isArray ? insertedList : insertedList[0];
    },

    async update(id, updates) {
      if (!useMock) {
        try {
          const payload = {};
          if (updates.dni !== undefined) payload.dni = updates.dni;
          if (updates.nombre !== undefined) payload.nombre = updates.nombre;
          if (updates.apellido !== undefined) payload.apellido = updates.apellido;
          if (updates.asiste !== undefined) payload.asiste = updates.asiste;
          if (updates.menores !== undefined) payload.menores = updates.menores;
          if (updates.restricciones_alimentarias !== undefined) payload.restricciones_alimentarias = updates.restricciones_alimentarias;
          if (updates.comentarios !== undefined) payload.comentarios = updates.comentarios;

          const { data, error } = await supabase
            .from('confirmaciones')
            .update(payload)
            .eq('id', id)
            .select()
            .single();

          if (error) throw error;
          
          return {
            id: data.id,
            dni: data.dni,
            nombre: data.nombre,
            apellido: data.apellido,
            asiste: data.asiste,
            menores: data.menores,
            restricciones_alimentarias: data.restricciones_alimentarias,
            comentarios: data.comentarios,
            fecha_creacion: data.fecha_respuesta
          };
        } catch (err) {
          console.error('Failed to update confirmation on Supabase:', err);
        }
      }

      initLocalStorage();
      const rsvps = JSON.parse(localStorage.getItem('np_confirmations') || '[]');
      const idx = rsvps.findIndex(r => r.id === id);
      if (idx !== -1) {
        rsvps[idx] = { ...rsvps[idx], ...updates };
        localStorage.setItem('np_confirmations', JSON.stringify(rsvps));
        return rsvps[idx];
      }
      throw new Error('RSVP not found');
    },

    async delete(id) {
      if (!useMock) {
        try {
          const { error } = await supabase
            .from('confirmaciones')
            .delete()
            .eq('id', id);
          if (error) throw error;
          return;
        } catch (err) {
          console.error('Failed to delete confirmation from Supabase:', err);
        }
      }

      initLocalStorage();
      const rsvps = JSON.parse(localStorage.getItem('np_confirmations') || '[]');
      const filtered = rsvps.filter(r => r.id !== id);
      localStorage.setItem('np_confirmations', JSON.stringify(filtered));
    }
  },

  // SONGS (SUGGESTIONS)
  songs: {
    async list() {
      if (!useMock) {
        try {
          const { data, error } = await supabase
            .from('canciones_sugeridas')
            .select('*')
            .order('fecha', { ascending: false });
          if (error) throw error;
          return data;
        } catch (err) {
          console.error('Failed to list songs from Supabase:', err);
        }
      }

      initLocalStorage();
      return JSON.parse(localStorage.getItem('np_songs') || '[]');
    },

    async add(songData) {
      const songToInsert = {
        ...songData,
        fecha: new Date().toISOString(),
        estado: 'nueva'
      };

      if (!useMock) {
        try {
          const { data, error } = await supabase
            .from('canciones_sugeridas')
            .insert(songToInsert)
            .select()
            .single();
          if (error) throw error;
          return data;
        } catch (err) {
          console.error('Failed to add song suggestion to Supabase:', err);
        }
      }

      initLocalStorage();
      const songs = JSON.parse(localStorage.getItem('np_songs') || '[]');
      const newSong = {
        id: 'song-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5),
        fecha_creacion: new Date().toISOString(),
        ...songToInsert
      };
      songs.push(newSong);
      localStorage.setItem('np_songs', JSON.stringify(songs));
      return newSong;
    },

    async delete(id) {
      if (!useMock) {
        try {
          const { error } = await supabase
            .from('canciones_sugeridas')
            .delete()
            .eq('id', id);
          if (error) throw error;
          return;
        } catch (err) {
          console.error('Failed to delete song suggestion from Supabase:', err);
        }
      }

      initLocalStorage();
      const songs = JSON.parse(localStorage.getItem('np_songs') || '[]');
      const filtered = songs.filter(s => s.id !== id);
      localStorage.setItem('np_songs', JSON.stringify(filtered));
    }
  },

  // MESSAGES (LIBRO DE FIRMAS)
  messages: {
    async list() {
      if (!useMock) {
        try {
          const { data, error } = await supabase
            .from('mensajes')
            .select('*')
            .order('fecha_creacion', { ascending: false });
          if (error) throw error;
          return data;
        } catch (err) {
          console.error('Failed to list messages from Supabase:', err);
        }
      }

      initLocalStorage();
      return JSON.parse(localStorage.getItem('np_messages') || '[]');
    },

    async add(msgData) {
      const newMsg = {
        autor: msgData.autor,
        mensaje: msgData.mensaje,
        fecha_creacion: new Date().toISOString()
      };

      if (!useMock) {
        try {
          const { data, error } = await supabase
            .from('mensajes')
            .insert(newMsg)
            .select()
            .single();
          if (error) throw error;
          return data;
        } catch (err) {
          console.error('Failed to add message to Supabase:', err);
        }
      }

      initLocalStorage();
      const messages = JSON.parse(localStorage.getItem('np_messages') || '[]');
      const localMsg = {
        id: 'msg-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5),
        ...newMsg
      };
      messages.push(localMsg);
      localStorage.setItem('np_messages', JSON.stringify(messages));
      return localMsg;
    },

    async delete(id) {
      if (!useMock) {
        try {
          const { error } = await supabase
            .from('mensajes')
            .delete()
            .eq('id', id);
          if (error) throw error;
          return;
        } catch (err) {
          console.error('Failed to delete message from Supabase:', err);
        }
      }

      initLocalStorage();
      const messages = JSON.parse(localStorage.getItem('np_messages') || '[]');
      const filtered = messages.filter(m => m.id !== id);
      localStorage.setItem('np_messages', JSON.stringify(filtered));
    }
  },

  // LOGS (HISTORIAL)
  logs: {
    async list() {
      if (!useMock) {
        try {
          const { data, error } = await supabase
            .from('historial_cambios')
            .select('*')
            .order('fecha_modificacion', { ascending: false });
          if (error) throw error;
          return data;
        } catch (err) {
          console.error('Failed to list history logs from Supabase:', err);
        }
      }

      initLocalStorage();
      return JSON.parse(localStorage.getItem('np_history') || '[]');
    }
  },

  // ASSETS UPLOADS (Base64 conversion / Supabase storage bucket fallback)
  assets: {
    async uploadPhoto(file) {
      if (!useMock) {
        try {
          const fileExt = file.name.split('.').pop();
          const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
          const filePath = `gallery/${fileName}`;

          const { error: uploadError } = await supabase.storage
            .from('invitation-assets')
            .upload(filePath, file);

          if (!uploadError) {
            const { data } = supabase.storage
              .from('invitation-assets')
              .getPublicUrl(filePath);
            return data.publicUrl;
          }
        } catch (e) {
          console.warn('Supabase storage upload failed, falling back to base64:', e);
        }
      }

      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = (err) => reject(err);
        reader.readAsDataURL(file);
      });
    },

    async uploadMusic(file) {
      if (!useMock) {
        try {
          const fileExt = file.name.split('.').pop();
          const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
          const filePath = `music/${fileName}`;

          const { error: uploadError } = await supabase.storage
            .from('invitation-assets')
            .upload(filePath, file);

          if (!uploadError) {
            const { data } = supabase.storage
              .from('invitation-assets')
              .getPublicUrl(filePath);
            return data.publicUrl;
          }
        } catch (e) {
          console.warn('Supabase music upload failed, falling back to base64:', e);
        }
      }

      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = (err) => reject(err);
        reader.readAsDataURL(file);
      });
    }
  },

  // AUTHENTICATION (Supabase Auth vs Mock Session)
  auth: {
    async login(email, password) {
      if (!useMock) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (error) throw error;
        localStorage.setItem('np_session_active', JSON.stringify(data.user));
        return data.user;
      }

      // Mock login
      if (email === 'admin@nestorypame.com' && password === 'nestorypame2026') {
        const mockUser = { email, id: 'admin-id' };
        localStorage.setItem('np_session_active', JSON.stringify(mockUser));
        return mockUser;
      } else {
        throw new Error('Credenciales incorrectas (Modo Desconectado).');
      }
    },

    async logout() {
      if (!useMock) {
        await supabase.auth.signOut();
      }
      localStorage.removeItem('np_session_active');
    },

    async getUser() {
      if (!useMock) {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          return user;
        } catch (e) {
          return null;
        }
      }

      const userStr = localStorage.getItem('np_session_active');
      return userStr ? JSON.parse(userStr) : null;
    }
  }
};

import express from 'express';
import cors from 'cors';
import Firebird from 'node-firebird';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Express setup
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '20mb' })); // Support base64 image uploads

// Firebird DB Settings
const firebirdOptions = {
  host: process.env.FIREBIRD_HOST || '127.0.0.1',
  port: parseInt(process.env.FIREBIRD_PORT || '3050'),
  database: process.env.FIREBIRD_DATABASE || 'C:\\Users\\artez\\Documents\\casamiento\\casamiento.fdb',
  user: process.env.FIREBIRD_USER || 'SYSDBA',
  password: process.env.FIREBIRD_PASSWORD || 'masterkey',
  blobAsText: true,        // Read text blobs as string automatically
  blobReadChunkSize: 65535,
  blobChunkSize: 65535
};

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

// Database schema table definitions
const tables = [
  {
    name: 'CONFIGURACION',
    sql: `CREATE TABLE CONFIGURACION (
      ID INTEGER NOT NULL PRIMARY KEY,
      TIPO VARCHAR(20) NOT NULL UNIQUE,
      CONFIG_JSON BLOB SUB_TYPE TEXT NOT NULL
    )`
  },
  {
    name: 'RSVPS',
    sql: `CREATE TABLE RSVPS (
      ID INTEGER NOT NULL PRIMARY KEY,
      DNI VARCHAR(20) NOT NULL UNIQUE,
      NOMBRE VARCHAR(100) NOT NULL,
      APELLIDO VARCHAR(100) NOT NULL,
      ASISTENCIA VARCHAR(10) NOT NULL,
      MENORES INTEGER NOT NULL,
      DIETA VARCHAR(150),
      COMENTARIO VARCHAR(255),
      FECHA_CREACION TIMESTAMP NOT NULL
    )`
  },
  {
    name: 'CANCIONES',
    sql: `CREATE TABLE CANCIONES (
      ID INTEGER NOT NULL PRIMARY KEY,
      INVITADO VARCHAR(100) NOT NULL,
      CANCION VARCHAR(150) NOT NULL,
      ARTISTA VARCHAR(150) NOT NULL,
      COMENTARIO VARCHAR(255),
      FECHA_CREACION TIMESTAMP NOT NULL
    )`
  },
  {
    name: 'FOTOS',
    sql: `CREATE TABLE FOTOS (
      ID INTEGER NOT NULL PRIMARY KEY,
      URL BLOB SUB_TYPE TEXT NOT NULL,
      TIPO VARCHAR(20) NOT NULL,
      POSICION_ENCUADRE VARCHAR(20) NOT NULL,
      ORDEN INTEGER NOT NULL,
      VISIBLE SMALLINT NOT NULL,
      ESTADO VARCHAR(20) NOT NULL
    )`
  },
  {
    name: 'AUDIOS',
    sql: `CREATE TABLE AUDIOS (
      ID INTEGER NOT NULL PRIMARY KEY,
      URL BLOB SUB_TYPE TEXT NOT NULL,
      NOMBRE VARCHAR(150) NOT NULL,
      TAMANO INTEGER NOT NULL,
      ACTIVO SMALLINT NOT NULL
    )`
  },
  {
    name: 'HISTORIAL_LOGS',
    sql: `CREATE TABLE HISTORIAL_LOGS (
      ID INTEGER NOT NULL PRIMARY KEY,
      USUARIO VARCHAR(100) NOT NULL,
      ACCION VARCHAR(50) NOT NULL,
      FECHA TIMESTAMP NOT NULL,
      DETALLE VARCHAR(255)
    )`
  }
];

// Helper to check and create a table
function createTableIfMissing(db, tableName, createSql, callback) {
  const checkSql = `SELECT RDB$RELATION_NAME FROM RDB$RELATIONS WHERE RDB$SYSTEM_FLAG = 0 AND RDB$RELATION_NAME = ?`;
  db.query(checkSql, [tableName.toUpperCase()], function(err, result) {
    if (err) return callback(err);
    
    if (result && result.length > 0) {
      console.log(`- Table ${tableName} is ready.`);
      return callback();
    }
    
    console.log(`- Table ${tableName} is missing. Creating...`);
    db.query(createSql, function(err) {
      if (err) return callback(err);
      console.log(`- Table ${tableName} created successfully.`);
      callback();
    });
  });
}

// Seed configs if table is empty
function seedInitialData(db, callback) {
  db.query('SELECT COUNT(*) AS CNT FROM CONFIGURACION', function(err, result) {
    if (err) return callback(err);
    const count = result[0].CNT;
    if (count > 0) {
      return callback();
    }
    
    console.log('Seeding default configurations into CONFIGURACION...');
    const draftSql = 'INSERT INTO CONFIGURACION (ID, TIPO, CONFIG_JSON) VALUES (1, ?, ?)';
    const pubSql = 'INSERT INTO CONFIGURACION (ID, TIPO, CONFIG_JSON) VALUES (2, ?, ?)';
    
    db.query(draftSql, ['draft', JSON.stringify(DEFAULT_CONFIG)], function(err) {
      if (err) return callback(err);
      db.query(pubSql, ['published', JSON.stringify(DEFAULT_CONFIG)], function(err) {
        if (err) return callback(err);
        console.log('Default configurations seeded successfully.');
        callback();
      });
    });
  });
}

// Sequential database schema creation
function initializeSchema(db, callback) {
  let index = 0;
  function next() {
    if (index >= tables.length) {
      return seedInitialData(db, callback);
    }
    const table = tables[index++];
    createTableIfMissing(db, table.name, table.sql, function(err) {
      if (err) return callback(err);
      next();
    });
  }
  next();
}

// Global Connection Pool
let dbPool = null;

// Initial connection check & schema setup
console.log('Connecting to Firebird SQL Database...');
Firebird.attachOrCreate(firebirdOptions, function(err, db) {
  if (err) {
    console.error('CRITICAL: Cannot connect or create Firebird database. Make sure Firebird Server is running.', err);
    process.exit(1);
  }
  
  console.log('Connected to Firebird database file successfully.');
  initializeSchema(db, function(err) {
    db.detach();
    if (err) {
      console.error('CRITICAL: Database schema initialization failed:', err);
      process.exit(1);
    }
    console.log('Database schema is verified and ready.');
    
    // Create query pool
    dbPool = Firebird.pool(10, firebirdOptions);
    
    // Start Express API server
    startWebServer();
  });
});

// Setup Express API endpoints
function startWebServer() {
  
  // Middleware to acquire connection from pool
  const withDb = (req, res, next) => {
    dbPool.get(function(err, db) {
      if (err) {
        console.error('Error getting database connection from pool:', err);
        return res.status(500).json({ error: 'Database connection pool exhausted' });
      }
      req.db = db;
      
      // Monkey patch res.send/json to release connection back to pool
      const originalJson = res.json;
      res.json = function(data) {
        db.detach();
        return originalJson.call(res, data);
      };
      
      const originalStatus = res.status;
      res.status = function(code) {
        // Return custom object to chain json/send
        const chain = originalStatus.call(res, code);
        const originalChainJson = chain.json;
        chain.json = function(data) {
          db.detach();
          return originalChainJson.call(chain, data);
        };
        return chain;
      };
      
      next();
    });
  };

  // Helper for autoincrement ID
  const getNextId = (db, tableName, callback) => {
    db.query(`SELECT COALESCE(MAX(ID), 0) + 1 AS NEXT_ID FROM ${tableName}`, function(err, result) {
      if (err) return callback(err);
      callback(null, result[0].NEXT_ID);
    });
  };

  // 1. AUTH LOGIN
  app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    if (email === 'admin@nestorypame.com' && password === 'nestorypame2026') {
      return res.json({ 
        token: 'session-token-firebird-nestorypame', 
        user: { email: 'admin@nestorypame.com' } 
      });
    }
    return res.status(401).json({ error: 'Credenciales inválidas' });
  });

  // 2. CONFIG: GET PUBLISHED
  app.get('/api/config/published', withDb, (req, res) => {
    req.db.query('SELECT CONFIG_JSON FROM CONFIGURACION WHERE TIPO = ?', ['published'], function(err, result) {
      if (err) return res.status(500).json({ error: err.message });
      if (!result || result.length === 0) return res.status(404).json({ error: 'Config not found' });
      
      try {
        const json = JSON.parse(result[0].CONFIG_JSON);
        res.json(json);
      } catch (e) {
        res.status(500).json({ error: 'Failed to parse config JSON' });
      }
    });
  });

  // 3. CONFIG: GET DRAFT
  app.get('/api/config/draft', withDb, (req, res) => {
    req.db.query('SELECT CONFIG_JSON FROM CONFIGURACION WHERE TIPO = ?', ['draft'], function(err, result) {
      if (err) return res.status(500).json({ error: err.message });
      if (!result || result.length === 0) return res.status(404).json({ error: 'Draft not found' });
      
      try {
        const json = JSON.parse(result[0].CONFIG_JSON);
        res.json(json);
      } catch (e) {
        res.status(500).json({ error: 'Failed to parse config JSON' });
      }
    });
  });

  // 4. CONFIG: SAVE DRAFT
  app.post('/api/config/draft', withDb, (req, res) => {
    const configString = JSON.stringify(req.body);
    req.db.query('UPDATE CONFIGURACION SET CONFIG_JSON = ? WHERE TIPO = ?', [configString, 'draft'], function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true });
    });
  });

  // 5. CONFIG: PUBLISH
  app.post('/api/config/publish', withDb, (req, res) => {
    // 1. Get draft JSON
    req.db.query('SELECT CONFIG_JSON FROM CONFIGURACION WHERE TIPO = ?', ['draft'], function(err, result) {
      if (err) return res.status(500).json({ error: err.message });
      if (!result || result.length === 0) return res.status(404).json({ error: 'Draft not found' });
      
      const configJsonStr = result[0].CONFIG_JSON;
      
      // 2. Write to published
      req.db.query('UPDATE CONFIGURACION SET CONFIG_JSON = ? WHERE TIPO = ?', [configJsonStr, 'published'], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        
        // 3. Copy photos from draft to published
        req.db.query('DELETE FROM FOTOS WHERE ESTADO = ?', ['published'], function(err) {
          if (err) return res.status(500).json({ error: err.message });
          
          req.db.query('SELECT URL, TIPO, POSICION_ENCUADRE, ORDEN, VISIBLE FROM FOTOS WHERE ESTADO = ?', ['draft'], function(err, resultPhotos) {
            if (err) return res.status(500).json({ error: err.message });
            
            let photoIndex = 0;
            function copyNextPhoto() {
              if (photoIndex >= resultPhotos.length) {
                // 4. Log to history and send response
                getNextId(req.db, 'HISTORIAL_LOGS', function(err, nextId) {
                  if (err) return res.status(500).json({ error: err.message });
                  
                  req.db.query(
                    'INSERT INTO HISTORIAL_LOGS (ID, USUARIO, ACCION, FECHA, DETALLE) VALUES (?, ?, ?, ?, ?)',
                    [nextId, 'admin@nestorypame.com', 'publicar_cambios', new Date(), 'Se publicaron los cambios del borrador al sitio público.'],
                    function(err) {
                      if (err) return res.status(500).json({ error: err.message });
                      res.json({ success: true });
                    }
                  );
                });
                return;
              }
              
              const p = resultPhotos[photoIndex];
              req.db.query(
                'INSERT INTO FOTOS (ID, URL, TIPO, POSICION_ENCUADRE, ORDEN, VISIBLE, ESTADO) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [photoIndex + 100, p.URL, p.TIPO, p.POSICION_ENCUADRE, p.ORDEN, p.VISIBLE, 'published'],
                function(err) {
                  if (err) return res.status(500).json({ error: err.message });
                  photoIndex++;
                  copyNextPhoto();
                }
              );
            }
            copyNextPhoto();
          });
        });
      });
    });
  });

  // 6. RSVPS: GET ALL
  app.get('/api/rsvps', withDb, (req, res) => {
    req.db.query('SELECT ID, DNI, NOMBRE, APELLIDO, ASISTENCIA, MENORES, DIETA, COMENTARIO, FECHA_CREACION FROM RSVPS ORDER BY FECHA_CREACION DESC', function(err, result) {
      if (err) return res.status(500).json({ error: err.message });
      
      // Clean dates and parse types
      const list = (result || []).map(r => ({
        id: r.ID,
        dni: r.DNI,
        nombre: r.NOMBRE,
        apellido: r.APELLIDO,
        asistencia: r.ASISTENCIA,
        menores: r.MENORES,
        dieta: r.DIETA || '',
        comentario: r.COMENTARIO || '',
        fecha_creacion: r.FECHA_CREACION
      }));
      res.json(list);
    });
  });

  // 7. RSVPS: CREATE
  app.post('/api/rsvps', withDb, (req, res) => {
    const { dni, nombre, apellido, asistencia, menores, dieta, comentario } = req.body;
    
    if (!dni || !nombre || !apellido || !asistencia) {
      return res.status(400).json({ error: 'Campos requeridos faltantes.' });
    }

    // Check duplicate DNI
    req.db.query('SELECT ID FROM RSVPS WHERE DNI = ?', [dni], function(err, result) {
      if (err) return res.status(500).json({ error: err.message });
      if (result && result.length > 0) {
        return res.status(400).json({ error: 'Este DNI ya registró su confirmación de asistencia.' });
      }

      getNextId(req.db, 'RSVPS', function(err, nextId) {
        if (err) return res.status(500).json({ error: err.message });
        
        req.db.query(
          'INSERT INTO RSVPS (ID, DNI, NOMBRE, APELLIDO, ASISTENCIA, MENORES, DIETA, COMENTARIO, FECHA_CREACION) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
          [nextId, dni, nombre, apellido, asistencia, parseInt(menores || '0'), dieta || '', comentario || '', new Date()],
          function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ success: true, id: nextId });
          }
        );
      });
    });
  });

  // 8. RSVPS: UPDATE
  app.put('/api/rsvps/:id', withDb, (req, res) => {
    const id = parseInt(req.params.id);
    const { dni, nombre, apellido, asistencia, menores, dieta, comentario } = req.body;
    
    // Check duplicate DNI excluding this ID
    req.db.query('SELECT ID FROM RSVPS WHERE DNI = ? AND ID <> ?', [dni, id], function(err, result) {
      if (err) return res.status(500).json({ error: err.message });
      if (result && result.length > 0) {
        return res.status(400).json({ error: 'Otro invitado ya tiene registrado este DNI.' });
      }

      req.db.query(
        'UPDATE RSVPS SET DNI=?, NOMBRE=?, APELLIDO=?, ASISTENCIA=?, MENORES=?, DIETA=?, COMENTARIO=? WHERE ID=?',
        [dni, nombre, apellido, asistencia, parseInt(menores || '0'), dieta || '', comentario || '', id],
        function(err) {
          if (err) return res.status(500).json({ error: err.message });
          res.json({ success: true });
        }
      );
    });
  });

  // 9. RSVPS: DELETE
  app.delete('/api/rsvps/:id', withDb, (req, res) => {
    const id = parseInt(req.params.id);
    req.db.query('DELETE FROM RSVPS WHERE ID = ?', [id], function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true });
    });
  });

  // 10. SONGS: GET ALL
  app.get('/api/songs', withDb, (req, res) => {
    req.db.query('SELECT ID, INVITADO, CANCION, ARTISTA, COMENTARIO, FECHA_CREACION FROM CANCIONES ORDER BY FECHA_CREACION DESC', function(err, result) {
      if (err) return res.status(500).json({ error: err.message });
      
      const list = (result || []).map(r => ({
        id: r.ID,
        invitado: r.INVITADO,
        cancion: r.CANCION,
        artista: r.ARTISTA,
        comentario: r.COMENTARIO || '',
        fecha_creacion: r.FECHA_CREACION
      }));
      res.json(list);
    });
  });

  // 11. SONGS: CREATE
  app.post('/api/songs', withDb, (req, res) => {
    const { invitado, cancion, artista, comentario } = req.body;
    if (!invitado || !cancion || !artista) {
      return res.status(400).json({ error: 'Campos requeridos faltantes.' });
    }

    getNextId(req.db, 'CANCIONES', function(err, nextId) {
      if (err) return res.status(500).json({ error: err.message });
      
      req.db.query(
        'INSERT INTO CANCIONES (ID, INVITADO, CANCION, ARTISTA, COMENTARIO, FECHA_CREACION) VALUES (?, ?, ?, ?, ?, ?)',
        [nextId, invitado, cancion, artista, comentario || '', new Date()],
        function(err) {
          if (err) return res.status(500).json({ error: err.message });
          res.json({ success: true, id: nextId });
        }
      );
    });
  });

  // 12. SONGS: DELETE
  app.delete('/api/songs/:id', withDb, (req, res) => {
    const id = parseInt(req.params.id);
    req.db.query('DELETE FROM CANCIONES WHERE ID = ?', [id], function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true });
    });
  });

  // 13. PHOTOS: GET BY STATE
  app.get('/api/photos', withDb, (req, res) => {
    const state = req.query.state || 'published';
    req.db.query('SELECT ID, URL, TIPO, POSICION_ENCUADRE, ORDEN, VISIBLE FROM FOTOS WHERE ESTADO = ? ORDER BY ORDEN ASC', [state], function(err, result) {
      if (err) return res.status(500).json({ error: err.message });
      
      const list = (result || []).map(r => ({
        id: r.ID,
        url: r.URL,
        tipo: r.TIPO,
        posicion_encuadre: r.POSICION_ENCUADRE,
        orden: r.ORDEN,
        visible: r.VISIBLE === 1,
        state: state
      }));
      res.json(list);
    });
  });

  // 14. PHOTOS: SAVE/SYNC ALL FOR STATE
  app.post('/api/photos', withDb, (req, res) => {
    const photosList = req.body; // Expecting array
    const state = req.query.state || 'draft';
    
    // Delete existing for this state
    req.db.query('DELETE FROM FOTOS WHERE ESTADO = ?', [state], function(err) {
      if (err) return res.status(500).json({ error: err.message });
      if (photosList.length === 0) return res.json({ success: true });
      
      let index = 0;
      function insertNext() {
        if (index >= photosList.length) {
          return res.json({ success: true });
        }
        const p = photosList[index];
        req.db.query(
          'INSERT INTO FOTOS (ID, URL, TIPO, POSICION_ENCUADRE, ORDEN, VISIBLE, ESTADO) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [p.id || index + 1, p.url, p.tipo, p.posicion_encuadre, p.orden, p.visible ? 1 : 0, state],
          function(err) {
            if (err) return res.status(500).json({ error: err.message });
            index++;
            insertNext();
          }
        );
      }
      insertNext();
    });
  });

  // 15. AUDIOS: GET ALL
  app.get('/api/audios', withDb, (req, res) => {
    req.db.query('SELECT ID, URL, NOMBRE, TAMANO, ACTIVO FROM AUDIOS', function(err, result) {
      if (err) return res.status(500).json({ error: err.message });
      
      const list = (result || []).map(r => ({
        id: r.ID,
        url: r.URL,
        nombre: r.NOMBRE,
        tamano: r.TAMANO,
        activo: r.ACTIVO === 1
      }));
      res.json(list);
    });
  });

  // 16. AUDIOS: SAVE/SYNC ALL
  app.post('/api/audios', withDb, (req, res) => {
    const audiosList = req.body;
    
    req.db.query('DELETE FROM AUDIOS', function(err) {
      if (err) return res.status(500).json({ error: err.message });
      if (audiosList.length === 0) return res.json({ success: true });
      
      let index = 0;
      function insertNext() {
        if (index >= audiosList.length) {
          return res.json({ success: true });
        }
        const a = audiosList[index];
        req.db.query(
          'INSERT INTO AUDIOS (ID, URL, NOMBRE, TAMANO, ACTIVO) VALUES (?, ?, ?, ?, ?)',
          [a.id, a.url, a.nombre, a.tamano, a.activo ? 1 : 0],
          function(err) {
            if (err) return res.status(500).json({ error: err.message });
            index++;
            insertNext();
          }
        );
      }
      insertNext();
    });
  });

  // 17. AUDIT LOGS: GET ALL
  app.get('/api/logs', withDb, (req, res) => {
    req.db.query('SELECT ID, USUARIO, ACCION, FECHA, DETALLE FROM HISTORIAL_LOGS ORDER BY FECHA DESC', function(err, result) {
      if (err) return res.status(500).json({ error: err.message });
      
      const list = (result || []).map(r => ({
        id: r.ID,
        usuario: r.USUARIO,
        accion: r.ACCION,
        fecha: r.FECHA,
        detalle: r.DETALLE || ''
      }));
      res.json(list);
    });
  });

  // Serve static files in production
  app.use(express.static(path.join(__dirname, 'dist')));

  // Wildcard fallback to index.html for React Router in production
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });

  app.listen(PORT, () => {
    console.log(`Express API Server running on port ${PORT}`);
  });
}

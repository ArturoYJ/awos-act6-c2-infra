const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3002;

// Middlewares
app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:3001' }));
app.use(express.json()); // Permite a Express entender JSON en el body

// Configuración del Pool de PostgreSQL
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: process.env.DB_HOST && process.env.DB_HOST.includes('neon.tech') ? { rejectUnauthorized: false } : false
});

// Función de inicialización: Crear la tabla si no existe
const initDB = async () => {
  try {
    // Usamos código SQL estándar para crear la estructura
    await pool.query(`
      CREATE TABLE IF NOT EXISTS history (
        id SERIAL PRIMARY KEY,
        prompt TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Tabla "history" verificada/creada con éxito en PostgreSQL.');
  } catch (err) {
    console.error('Error inicializando la base de datos:', err);
  }
};

initDB();

app.post('/api/history', async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'El prompt es requerido' });
  }

  try {
    // Inserción parametrizada ($1) para evitar Inyección SQL (Seguridad)
    const result = await pool.query(
      'INSERT INTO history (prompt) VALUES ($1) RETURNING *',
      [prompt]
    );
    
    // Respondemos con código 201 (Created)
    res.status(201).json({ 
        success: true, 
        message: 'Historial guardado',
        data: result.rows[0] 
    });
  } catch (err) {
    console.error('Error al insertar en DB:', err);
    res.status(500).json({ error: 'Error interno del servidor de base de datos' });
  }
});

// Levantar el servidor
app.listen(port, () => {
  console.log(`Microservicio de Historial corriendo en http://localhost:${port}`);
});
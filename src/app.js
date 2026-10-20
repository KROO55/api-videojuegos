import express from 'express';
export function createApp(pool) {
  const app = express();
  app.disable('x-powered-by');
  app.get('/', (req, res) => res.json({ nombre: 'API de videojuegos', ejemplo: '/api/videojuegos/1', listado: '/api/videojuegos', salud: '/health' }));
  app.get('/health', async (req, res) => {
    try { await pool.query('SELECT 1'); res.json({ estado: 'ok', base_de_datos: 'conectada' }); }
    catch { res.status(503).json({ error: 'Base de datos no disponible' }); }
  });
  app.get('/api/videojuegos', async (req, res) => {
    const { rows } = await pool.query('SELECT * FROM videojuegos ORDER BY id LIMIT 100');
    res.json(rows);
  });
  app.get('/api/videojuegos/:id', async (req, res) => {
    if (!/^[1-9]\d{0,9}$/.test(req.params.id) || Number(req.params.id) > 2147483647) return res.status(400).json({ error: 'El id debe ser un entero positivo valido' });
    const { rows } = await pool.query('SELECT * FROM videojuegos WHERE id = $1', [Number(req.params.id)]);
    if (!rows.length) return res.status(404).json({ error: 'Videojuego no encontrado' });
    res.json(rows[0]);
  });
  app.use((req, res) => res.status(404).json({ error: 'Ruta no encontrada' }));
  app.use((error, req, res, next) => { console.error('Error en consulta:', error.code || error.name); res.status(500).json({ error: 'No se pudo completar la consulta' }); });
  return app;
}

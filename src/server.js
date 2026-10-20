import { pool, initialize } from './db.js';
import { createApp } from './app.js';
try {
  await initialize();
  const server = createApp(pool).listen(Number(process.env.PORT || 3000), '0.0.0.0', () => console.log(`API disponible en puerto ${process.env.PORT || 3000}`));
  for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => {
    server.close(async () => { await pool.end(); process.exit(0); });
    setTimeout(() => process.exit(1), 10000).unref();
  });
} catch (error) { console.error('No se pudo iniciar la API:', error.code || error.name); await pool.end(); process.exitCode = 1; }

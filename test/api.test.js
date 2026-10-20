import { test } from 'node:test';
import assert from 'node:assert/strict';
import { pool, initialize } from '../src/db.js';
import { createApp } from '../src/app.js';
test('API con PostgreSQL real', async () => {
  await initialize();
  const server = createApp(pool).listen(0, '127.0.0.1');
  await new Promise(resolve => server.once('listening', resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  try {
    for (const [path, status] of [['/health',200],['/api/videojuegos',200],['/api/videojuegos/1',200],['/api/videojuegos/999',404],['/api/videojuegos/abc',400],['/api/videojuegos/0',400],['/api/videojuegos/2147483648',400],['/api/videojuegos/1%20OR%201=1',400],['/no-existe',404]]) {
      const res = await fetch(base + path); assert.equal(res.status, status, path);
      const data = await res.json();
      if (path === '/api/videojuegos/1') { assert.equal(data.nombre, 'Super Mario Bros.'); assert.deepEqual(data.consolas,['NES']); }
      if (path === '/api/videojuegos') {
        assert.equal(data.length,100);
        assert.deepEqual(data.map(juego => juego.id), Array.from({length:100}, (_, i) => i + 1));
        assert.equal(new Set(data.map(juego => juego.nombre)).size, 100);
      }
    }
    for (const id of [11, 50, 100]) {
      const res = await fetch(`${base}/api/videojuegos/${id}`);
      assert.equal(res.status, 200);
      const juego = await res.json();
      assert.equal(juego.id, id);
      assert.ok(juego.nombre && juego.consolas.length && juego.genero && juego.desarrollador);
      if (id === 100) assert.equal(juego.nombre, 'Cuphead');
    }
  } finally { await new Promise(resolve => server.close(resolve)); await pool.end(); }
});

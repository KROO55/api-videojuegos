# API de videojuegos

Node.js + Express + PostgreSQL en Docker, preparada para Render y n8n.

## Ejecutar localmente (PowerShell)

Requisitos: Node.js 22 o posterior, Docker Desktop y Git.

```powershell
Copy-Item .env.example .env
# Cambia CAMBIA_ESTA_CLAVE en las dos ubicaciones de .env por la misma clave.
npm.cmd ci
docker compose up -d --wait
npm.cmd start
```

En esta computadora ya se genero un `.env` local con clave aleatoria. No lo sobrescribas si el contenedor ya existe: cambiar `.env` no cambia la clave de una base creada.

Consulta http://localhost:3000/api/videojuegos/1 o usa:

```powershell
Invoke-RestMethod http://localhost:3000/api/videojuegos/1
npm.cmd test
docker compose ps
docker volume ls
```

Rutas GET: `/`, `/health`, `/api/videojuegos`, `/api/videojuegos/:id`.
Los ID 1 a 10 estan cargados. Un ID invalido devuelve 400; uno inexistente, 404.
Es una API publica de solo lectura: n8n no requiere credenciales para consultarla.

```json
{"id":1,"nombre":"Super Mario Bros.","anio_lanzamiento":1985,"consolas":["NES"],"genero":"Plataformas","desarrollador":"Nintendo"}
```

Los datos indican plataformas del lanzamiento original, no todas las adaptaciones posteriores. El catalogo es una semilla educativa editable en `sql/init.sql`.
Las consultas usan parametros SQL. Los errores no muestran credenciales.

## Imagen y volumen

`postgres:17-alpine` es la imagen. `postgres_data` es el volumen montado en `/var/lib/postgresql/data`, con prefijo de proyecto en Docker.
`docker compose stop` y `docker compose down` conservan el volumen. No uses `down -v` si deseas conservar datos.
El puerto PostgreSQL solo se publica en la interfaz local, puerto 5433.
La API crea la tabla y agrega los juegos faltantes al iniciar, dentro de una transaccion, sin borrar filas existentes.

## GitHub y Render

`.gitignore` excluye `.env` y `node_modules`; `.env.example` solo contiene marcadores.
Sube el contenido de esta carpeta como raiz del repositorio.
En Render: New > Blueprint > conectar el repositorio > revisar `render.yaml` > Deploy.
El Blueprint crea el servicio Node y una base PostgreSQL de Render, con `DATABASE_URL` enlazada y acceso externo de PostgreSQL bloqueado.
Docker y su volumen se usan localmente; Render usa su propia base persistente. Render no puede conectarse al localhost de tu PC.
Tras el despliegue prueba `https://TU-SERVICIO.onrender.com/health` y `/api/videojuegos/1`.
Los commits enviados a la rama vinculada permiten desplegar actualizaciones.
Revisa las condiciones del plan gratuito mostradas por Render antes de crear recursos; puede tener caducidad o suspension. No es una configuracion de produccion con respaldo.

Documentacion: https://render.com/docs/blueprint-spec y https://render.com/docs/free

## Cliente n8n

Importa `n8n/videojuegos.json` desde el menu de workflows > Import from File.
El flujo es Inicio Clic > Configurar consulta > Consultar videojuego > Enviar correo con Gmail.
En Configurar consulta elige `id`, `api_url` y `correo`.
La URL local para n8n en Docker es `http://host.docker.internal:3000`. Si n8n corre directamente en tu PC usa `http://localhost:3000`. n8n Cloud requiere la URL publica de Render.
Una vez desplegada, sustituye `api_url` por `https://TU-SERVICIO.onrender.com`, sin barra final.
Gmail esta desactivado para permitir probar consultas: selecciona tu credencial Gmail OAuth2 en n8n y activa ese nodo para enviar correos. No hay credenciales exportadas.
Ejecuta el flujo manualmente; el nodo HTTP devuelve el objeto JSON y Gmail utiliza sus campos.

Para reproducir tu practica de Sheets, puedes sustituir Configurar consulta por Google Sheets con una columna `id` y construir la URL en el nodo HTTP. El flujo entregado no modifica hojas existentes.
Documentacion: https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.httprequest/

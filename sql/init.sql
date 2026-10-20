CREATE TABLE IF NOT EXISTS videojuegos (
  id INTEGER PRIMARY KEY,
  nombre TEXT NOT NULL,
  anio_lanzamiento INTEGER NOT NULL CHECK (anio_lanzamiento BETWEEN 1950 AND 2100),
  consolas TEXT[] NOT NULL,
  genero TEXT NOT NULL,
  desarrollador TEXT NOT NULL
);
INSERT INTO videojuegos VALUES
 (1, 'Super Mario Bros.', 1985, ARRAY['NES'], 'Plataformas', 'Nintendo'),
 (2, 'The Legend of Zelda: Ocarina of Time', 1998, ARRAY['Nintendo 64'], 'Accion y aventura', 'Nintendo'),
 (3, 'Minecraft', 2011, ARRAY['PC'], 'Sandbox', 'Mojang'),
 (4, 'Halo: Combat Evolved', 2001, ARRAY['Xbox'], 'Disparos', 'Bungie'),
 (5, 'God of War', 2018, ARRAY['PlayStation 4'], 'Accion y aventura', 'Santa Monica Studio'),
 (6, 'Sonic the Hedgehog', 1991, ARRAY['Sega Genesis'], 'Plataformas', 'Sonic Team'),
 (7, 'Resident Evil 4', 2005, ARRAY['GameCube'], 'Survival horror', 'Capcom'),
 (8, 'Street Fighter II', 1991, ARRAY['Arcade'], 'Lucha', 'Capcom'),
 (9, 'Final Fantasy VII', 1997, ARRAY['PlayStation'], 'RPG', 'Square'),
 (10, 'The Legend of Zelda: Breath of the Wild', 2017, ARRAY['Nintendo Switch', 'Wii U'], 'Accion y aventura', 'Nintendo')
ON CONFLICT (id) DO NOTHING;

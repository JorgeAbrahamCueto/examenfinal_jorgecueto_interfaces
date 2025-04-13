CREATE DATABASE retromusicvideo_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
use retromusicvideo_db;
-- -----------------------------------------------------
-- Tabla: usuarios
-- Almacena la información de los usuarios registrados.
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS usuarios (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(100) NOT NULL,
  apellido VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  username VARCHAR(50) NOT NULL UNIQUE,
  -- En una aplicación real, NUNCA guardes contraseñas en texto plano.
  -- Usa funciones de hash como password_hash() de PHP o equivalentes.
  password_hash VARCHAR(255) NOT NULL,
  fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;
select * from usuarios;
-- -----------------------------------------------------
-- Tabla: productos
-- Almacena la información de los productos disponibles en la tienda.
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS productos (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(255) NOT NULL,
  descripcion TEXT NULL, -- Puede ser nulo si no todos los productos tienen descripción
  categoria VARCHAR(100) NULL, -- Ejemplo: 'Musica-Pop', 'Videojuegos-Estrategia', 'HomeVideo-Fantasia'
  precio DECIMAL(10, 2) NOT NULL, -- Ejemplo: 10 representa el número total de dígitos, 2 los decimales (99999999.99)
  imagen_url VARCHAR(512) NULL, -- Ruta o URL de la imagen del producto
  stock INT NOT NULL DEFAULT 0, -- Añadir stock es buena práctica para tiendas
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;
INSERT INTO productos (nombre, descripcion, categoria, precio, imagen_url, stock) VALUES
('Audioslave – Audioslave', 'Álbum debut de la banda de rock estadounidense Audioslave.', 'Musica-Alternativo', 169.00, '/images/Portadas Musica/audioslave300x300.jpg', 15),
('Britney Spears - Oops! i did it again', 'Segundo álbum de estudio de Britney Spears, lanzado en el año 2000.', 'Musica-Pop', 220.00, '/images/Portadas Musica/britney spears300x300.jpg', 5),
('Hector Lavoe - Revento', 'Álbum de salsa del cantante puertorriqueño Héctor Lavoe, lanzado en 1985.', 'Musica-Salsa', 180.00, '/images/Portadas Musica/hector lavoe300x300.jpg', 5),
('Limp Bizkit - Significant Other', 'Segundo álbum de estudio de la banda estadounidense Limp Bizkit, lanzado en 1999.', 'Musica-Nu Metal', 185.00, '/images/Portadas Musica/limp bizkit300x300.jpg', 5),
('Nirvana - In Utero', 'Tercer y último álbum de estudio de la banda estadounidense Nirvana, lanzado en 1993.', 'Musica-Grunge', 165.00, '/images/Portadas Musica/nirvana300x300.jpg', 5),
('No Doubt - No Doubt', 'Álbum debut de la banda estadounidense No Doubt, lanzado en 1992.', 'Musica-Ska', 229.00, '/images/Portadas Musica/NoDoubtCover300x300.jpg', 5),
('Wu Tang Clan – Enter The Wu Tang (36 Chambers)', 'Álbum debut del grupo de hip hop estadounidense Wu-Tang Clan, lanzado en 1993.', 'Musica-Rap', 150.00, '/images/Portadas Musica/wu tang clan300x300.jpg', 5);
INSERT INTO productos (nombre, descripcion, categoria, precio, imagen_url, stock) VALUES
('Age of Empires', 'Juego de estrategia en tiempo real.', 'Videojuegos-Estrategia', 99.00, '/images/Portadas de videojuegos/age of empires300x300.jpg', 15);
INSERT INTO productos (nombre, descripcion, categoria, precio, imagen_url, stock) VALUES
('Fifa 98 - PS1', 'Juego de disparos en primera persona basado en la película de James Bond.', 'Videojuegos-Shooter en primera persona', 299.00, '/images/Portadas de videojuegos/fifa-98-201610922502_1300x300', 15),
('Goldeneye 64', 'Juego de estrategia en tiempo real.', 'Videojuegos-Estrategia', 299.00, '/images/Portadas de videojuegos/Goldeneye64300x300.jpg"', 15),
('Need for Speed 2', 'Juego de carreras de autos lanzado en 1997.', 'Videojuegos-Carrera', 200.00, '/images/Portadas de videojuegos/need for speed300x300.jpg', 15),
('Resident Evil - Director´s Cut - PS1', 'Versión del director del juego de terror Resident Evil para PlayStation 1.', 'Videojuegos-Survival Horror', 300.00, '/images/Portadas de videojuegos/resident evil300x300', 15),
('Super Mario World', 'Juego de plataformas clásico de Super Nintendo, lanzado en 1990.', 'Videojuegos-Plataformas', 500.00, '/images/Portadas de videojuegos/super mario world300x300.jpg', 5),
('Super Mario Bross', 'Juego de plataformas clásico de Nintendo, lanzado en 1985.', 'Videojuegos-Plataforma', 799.00, '/images/Portadas de videojuegos/super_mario_bros-1698422300x300.jpg', 2);
INSERT INTO productos (nombre, descripcion, categoria, precio, imagen_url, stock) VALUES
('Cocoon', 'Película de ciencia ficción dirigida por Ron Howard, lanzada en 1985.', 'HomeVideo-Ciencia Ficcion', 40.00, '/images/Portada Peliculas/cocoon300x300.jpg', 5),
('El Golpe', 'Película de comedia y crimen dirigida por George Roy Hill, lanzada en 1973.', 'HomeVideo-Comedia', 45.00, '/images/Portada Peliculas/el golpe300x300.jpg', 5),
('El señor de los anillos - La Trilogia completa', 'Trilogía completa de la saga El Señor de los Anillos, dirigida por Peter Jackson.', 'HomeVideo-Fantasia', 200.00, '/images/Portada Peliculas/el señor de los anilloas300x300.jpg', 5),
('Moonwalker', 'Película musical protagonizada por Michael Jackson, lanzada en 1988.', 'HomeVideo-Fantasia', 60.00, '/images/Portada Peliculas/Moonwalker300x300.jpg', 5),
('Rocky', 'Película de drama y deporte dirigida por John G. Avildsen, lanzada en 1976.', 'HomeVideo-Drama/Deporte', 60.00, '/images/Portada Peliculas/rocky300x300.jpg', 5),
('Volver al Futuro', 'Película de ciencia ficción y aventura dirigida por Robert Zemeckis, lanzada en 1985.', 'HomeVideo-Ciencia Ficcion', 60.00, '/images/Portada Peliculas/volver al futuro300x300.jpg', 5);
UPDATE productos
SET
    imagen_url = '/images/Portadas de videojuegos/resident evil300x300.jpg',
    descripcion = 'Versión del director del juego de terror Resident Evil para PlayStation 1.',
    categoria = 'Videojuegos-Survival Horror',
    precio = 300.00
WHERE
    id = 16;
select * from productos;
-- -----------------------------------------------------
-- Tabla: carrito_items
-- Representa los items que un usuario tiene en su carrito de compras activo.
-- Se relaciona con 'usuarios' y 'productos'.
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS carrito_items (
  id INT PRIMARY KEY AUTO_INCREMENT,
  usuario_id INT NOT NULL,
  producto_id INT NOT NULL,
  cantidad INT NOT NULL DEFAULT 1,
  fecha_agregado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  -- Claves foráneas
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    ON DELETE CASCADE -- Si se borra el usuario, se borran sus items del carrito
    ON UPDATE CASCADE,
  FOREIGN KEY (producto_id) REFERENCES productos(id)
    ON DELETE CASCADE -- Si se borra el producto, se elimina de los carritos
    ON UPDATE CASCADE,

  -- Evitar duplicados del mismo producto para el mismo usuario en el carrito
  UNIQUE KEY idx_usuario_producto (usuario_id, producto_id)
) ENGINE=InnoDB;
select * from carrito_items;
-- -----------------------------------------------------
-- Tabla: pedidos
-- Almacena la información de las órdenes o compras realizadas por los usuarios.
-- Se relaciona con 'usuarios'.
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS pedidos (
  id INT PRIMARY KEY AUTO_INCREMENT,
  usuario_id INT NOT NULL,
  fecha_pedido TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  total DECIMAL(10, 2) NOT NULL,
  estado VARCHAR(50) NOT NULL DEFAULT 'pendiente', -- Ej: 'pendiente', 'pagado', 'enviado', 'entregado', 'cancelado'
  -- Puedes añadir aquí campos para la dirección de envío si es necesario
  -- direccion_envio VARCHAR(255) NULL,
  -- ciudad_envio VARCHAR(100) NULL,
  -- etc...

  -- Clave foránea
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    ON DELETE RESTRICT -- No permitir borrar un usuario si tiene pedidos asociados fácilmente
    ON UPDATE CASCADE
) ENGINE=InnoDB;
select * from pedidos;
-- -----------------------------------------------------
-- Tabla: pedido_items
-- Almacena los detalles de cada producto dentro de un pedido específico.
-- Se relaciona con 'pedidos' y 'productos'.
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS pedido_items (
  id INT PRIMARY KEY AUTO_INCREMENT,
  pedido_id INT NOT NULL,
  producto_id INT NOT NULL,
  cantidad INT NOT NULL,
  precio_unitario DECIMAL(10, 2) NOT NULL, -- Guarda el precio al momento de la compra

  -- Claves foráneas
  FOREIGN KEY (pedido_id) REFERENCES pedidos(id)
    ON DELETE CASCADE -- Si se borra el pedido, se borran sus detalles
    ON UPDATE CASCADE,
  FOREIGN KEY (producto_id) REFERENCES productos(id)
    ON DELETE RESTRICT -- No permitir borrar un producto si está en pedidos pasados
    ON UPDATE CASCADE
) ENGINE=InnoDB;
select * from pedido_items;
-- -----------------------------------------------------
-- Tabla: pagos
-- Almacena los datos de pagos del usuario
-- Se relaciona con 'pedidos'.
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS pagos (
  id INT PRIMARY KEY AUTO_INCREMENT,
  pedido_id INT NOT NULL UNIQUE, -- Cada pedido tiene un pago principal asociado
  metodo_pago VARCHAR(50) DEFAULT 'simulado', -- Indicamos que es simulado
  gateway_id VARCHAR(255) NULL,      -- Podemos dejarlo NULL o poner 'N/A'
  estado_pago VARCHAR(50) NOT NULL DEFAULT 'completado', -- Asumimos éxito
  monto DECIMAL(10, 2) NOT NULL,
  moneda VARCHAR(3) NOT NULL DEFAULT 'PEN', -- O tu moneda
  fecha_pago TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE
) ENGINE=InnoDB;
select * from pagos;
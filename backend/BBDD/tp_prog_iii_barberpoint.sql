-- Barberpoint - Esquema de base de datos
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

CREATE DATABASE IF NOT EXISTS `tp_prog_iii_barberpoint` CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `tp_prog_iii_barberpoint`;

-- Tabla de productos (servicios + productos físicos)
CREATE TABLE `productos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(240) NOT NULL,
  `tipo` varchar(100) NOT NULL, -- SERVICIO | PRODUCTO
  `precio` float NOT NULL,
  `imagen` varchar(240) NOT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Tabla de tickets (turnos + ventas)
CREATE TABLE `tickets` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombreUsuario` varchar(240) NOT NULL,
  `barbero` varchar(100) NOT NULL,
  `fechaHoraTurno` datetime NOT NULL,
  `precioTotal` float NOT NULL,
  `fechaEmision` date NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Tabla de relación muchos a muchos productos-tickets
CREATE TABLE `productos_tickets` (
  `idProducto` int NOT NULL,
  `idTicket` int NOT NULL,
  `cantidad` int NOT NULL DEFAULT 1,
  `precioUnitario` float NOT NULL DEFAULT 0,
  KEY `idProducto` (`idProducto`),
  KEY `idTicket` (`idTicket`),
  CONSTRAINT `productos_tickets_ibfk_1` FOREIGN KEY (`idProducto`) REFERENCES `productos` (`id`),
  CONSTRAINT `productos_tickets_ibfk_2` FOREIGN KEY (`idTicket`) REFERENCES `tickets` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Tabla de usuarios administradores
CREATE TABLE `usuarios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `correo` varchar(240) NOT NULL,
  `password` varchar(240) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `correo` (`correo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Datos iniciales
INSERT INTO `productos` (`nombre`, `tipo`, `precio`, `imagen`, `activo`) VALUES
('Corte 60 min Santino', 'SERVICIO', 10000, '/img/corte_santino.jpg', 1),
('Corte 60 min Anibal', 'SERVICIO', 15000, '/img/corte_anibal.jpg', 1),
('Cera modeladora', 'PRODUCTO', 3000, '/img/cera_modeladora.jpg', 1),
('Gel fijador', 'PRODUCTO', 2500, '/img/gel_fijador.jpg', 1),
('Aerosol fijador', 'PRODUCTO', 3500, '/img/aerosol_fijador.jpg', 1),
('Shampoo para barba', 'PRODUCTO', 4000, '/img/shampoo_barba.jpg', 1);

-- Usuario admin demo (password en texto plano, para luego encriptar con bcrypt)
INSERT INTO `usuarios` (`correo`, `password`) VALUES
('admin@barberpoint.com', 'admin123');

COMMIT;

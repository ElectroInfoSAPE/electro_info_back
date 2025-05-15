-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS biblioteca;
USE biblioteca;

-- Tabla de libros
CREATE TABLE IF NOT EXISTS libros (
  id VARCHAR(36) PRIMARY KEY,
  codigo VARCHAR(50) UNIQUE NOT NULL,
  titulo VARCHAR(255) NOT NULL,
  autor VARCHAR(255) NOT NULL,
  isbn VARCHAR(13) UNIQUE NOT NULL,
  disponible BOOLEAN DEFAULT true,
  editorial VARCHAR(255),
  anioPublicacion INT,
  genero VARCHAR(100),
  disponibles INT NOT NULL DEFAULT 1,
  imagen VARCHAR(255),
  descripcion TEXT,
  ubicacion ENUM('grado', 'ciencias_biomedicas') NOT NULL
);

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS usuarios (
  id VARCHAR(36) PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  apellido VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  idTarjetaAustral VARCHAR(50) UNIQUE NOT NULL,
  rol ENUM('estudiante', 'profesor', 'bibliotecario') NOT NULL,
  estado ENUM('activo', 'suspendido', 'inactivo') NOT NULL DEFAULT 'activo',
  fechaRegistro DATE NOT NULL,
  carrera VARCHAR(100),
  departamento VARCHAR(100),
  limitePrestamos INT NOT NULL DEFAULT 5
);

-- Tabla de préstamos
CREATE TABLE IF NOT EXISTS prestamos (
  id VARCHAR(36) PRIMARY KEY,
  libroId VARCHAR(36) NOT NULL,
  usuarioId VARCHAR(36) NOT NULL,
  usuarioNombre VARCHAR(255) NOT NULL,
  fechaPrestamo DATE NOT NULL,
  LibroNombre VARCHAR(255) NOT NULL,
  fechaDevolucionPrevista DATE NOT NULL,
  fechaDevolucionReal DATE,
  estado ENUM('ACTIVO', 'DEVUELTO', 'VENCIDO') NOT NULL DEFAULT 'ACTIVO',
  renovaciones_hechas INT NOT NULL DEFAULT 0,
  diasRetraso INT,
  notas TEXT,
  autor VARCHAR(255) NOT NULL,
  FOREIGN KEY (libroId) REFERENCES libros(id),
  FOREIGN KEY (usuarioId) REFERENCES usuarios(id)
);

-- Índices
CREATE INDEX idx_libros_codigo ON libros(codigo);
CREATE INDEX idx_libros_isbn ON libros(isbn);
CREATE INDEX idx_usuarios_email ON usuarios(email);
CREATE INDEX idx_usuarios_tarjeta ON usuarios(idTarjetaAustral);
CREATE INDEX idx_prestamos_usuario ON prestamos(usuarioId);
CREATE INDEX idx_prestamos_libro ON prestamos(libroId);
CREATE INDEX idx_prestamos_estado ON prestamos(estado); 
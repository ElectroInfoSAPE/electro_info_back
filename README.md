# Sistema de Biblioteca - Backend

Este es el backend para el sistema de gestión de biblioteca desarrollado con Express, TypeScript y Sequelize.

## Requisitos Previos

- Node.js (v14 o superior)
- MySQL (v8.0 o superior)
- npm o yarn

## Configuración del Entorno

### 1. Clonar el Repositorio

```bash
git clone https://github.com/MateoAcha/electro_info_back.git
cd electro_info_back
```

### 2. Instalar Dependencias

```bash
npm install
```

### 3. Configuración de MySQL

1. Instalar MySQL:
```bash
sudo apt update
sudo apt install mysql-server
```

2. Configurar la seguridad de MySQL:
```bash
sudo mysql_secure_installation
```

3. Crear la base de datos:
```bash
mysql -u root -p
CREATE DATABASE biblioteca;
```

### 4. Configuración del Proyecto

1. Crear archivo .env en la raíz del proyecto con la siguiente estructura:
```env
DB_HOST=localhost
DB_USER=tu_usuario
DB_PASSWORD=tu_contraseña
DB_NAME=biblioteca
PORT=3000
```

2. Compilar el proyecto TypeScript:
```bash
npm run build
```

3. Ejecutar las migraciones:
```bash
npm run migrate
```

## Estructura del Proyecto

```
├── src/
│   ├── config/         # Configuración de la base de datos
│   ├── controllers/    # Controladores de la aplicación
│   ├── models/        # Modelos de Sequelize
│   ├── routes/        # Rutas de la API
│   ├── types/         # Definiciones de tipos TypeScript
│   └── index.ts       # Punto de entrada de la aplicación
├── .env               # Variables de entorno
├── tsconfig.json      # Configuración de TypeScript
└── package.json       # Dependencias y scripts
```

## Endpoints de la API

### Libros
- `GET /api/libros` - Obtener todos los libros
- `GET /api/libros/codigo/:code` - Buscar libro por código

### Préstamos
- `GET /api/prestamos/:id` - Obtener detalles de préstamo
- `POST /api/prestamos` - Crear préstamo
- `POST /api/prestamos/:id/devolver` - Devolver préstamo
- `POST /api/prestamos/:id/renovar` - Renovar préstamo

### Usuarios
- `GET /api/usuarios/:id` - Obtener información de usuario

## Scripts Disponibles

- `npm run dev` - Inicia el servidor en modo desarrollo
- `npm run build` - Compila el proyecto TypeScript
- `npm start` - Inicia el servidor en modo producción

## Modelos de Base de Datos

### Libro
- código
- título
- autor
- estado
- ubicación

### Usuario
- id
- nombre
- email
- tipo_usuario

### Prestamo
- id
- fecha_prestamo
- fecha_devolucion
- estado
- usuario_id
- libro_id

## Dependencias Principales

- express: Framework web
- sequelize: ORM para base de datos
- typescript: Soporte de tipos
- mysql2: Driver de MySQL
- dotenv: Manejo de variables de entorno

## Contribución

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

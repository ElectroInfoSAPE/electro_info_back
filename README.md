# Backend Biblioteca

Este es el backend para el sistema de gestión de biblioteca, desarrollado con Express.js y TypeScript.

## Requisitos previos

- Node.js (v14 o superior)
- MySQL (v8 o superior)
- npm o yarn

## Configuración

1. Clona el repositorio:
```bash
git clone <url-del-repositorio>
cd backend_electro_info
```

2. Instala las dependencias:
```bash
npm install
```

3. Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:
```env
PORT=3000
DB_HOST=localhost
DB_USER=tu_usuario
DB_PASSWORD=tu_contraseña
DB_NAME=biblioteca
DB_PORT=3306
```

4. Configura la base de datos:
- Abre MySQL y ejecuta el script de la base de datos ubicado en `src/database/schema.sql`
```bash
mysql -u tu_usuario -p < src/database/schema.sql
```

## Desarrollo

Para ejecutar el servidor en modo desarrollo:
```bash
npm run dev
```

## Producción

Para compilar y ejecutar en producción:
```bash
npm run build
npm start
```

## Endpoints API

### Libros
- `GET /api/libros` - Obtener todos los libros
- `GET /api/libros/codigo/:code` - Buscar libro por código/ISBN

### Préstamos
- `GET /api/prestamos/:id` - Obtener detalles de un préstamo
- `POST /api/prestamos` - Crear nuevo préstamo
- `POST /api/prestamos/:id/devolver` - Devolver un préstamo
- `POST /api/prestamos/:id/renovar` - Renovar un préstamo

### Usuarios
- `GET /api/usuarios/:id` - Obtener información de usuario con sus préstamos

## Estructura del Proyecto

```
src/
  ├── config/         # Configuración de la base de datos
  ├── controllers/    # Controladores de la API
  ├── database/       # Scripts SQL y migraciones
  ├── routes/         # Rutas de la API
  ├── types/          # Definiciones de tipos TypeScript
  └── index.ts        # Punto de entrada de la aplicación
``` # electro_info_back

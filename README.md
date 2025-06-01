# Electro Info Backend

Backend para sistema de biblioteca electrónica desarrollado con Node.js, Express y Sequelize.

## 🚀 Inicio Rápido

### Opción 1: Script Automático (Recomendado)

```bash
# Hacer el script ejecutable
chmod +x start.sh

# Ejecutar setup completo
./start.sh
```

Este script automáticamente:
- ✅ Crea el archivo `.env` si no existe
- ✅ Verifica que MySQL esté instalado y corriendo
- ✅ Instala las dependencias de Node.js
- ✅ Crea la base de datos automáticamente
- ✅ Genera todas las tablas basadas en los modelos
- ✅ Puebla la base de datos con datos de ejemplo
- ✅ Inicia el servidor

### Opción 2: Pasos Manuales

1. **Instalar dependencias:**
```bash
npm install
```

2. **Configurar variables de entorno:**
Crea un archivo `.env` en la raíz del proyecto:
```env
# Configuración de la base de datos
DB_HOST=localhost
DB_PORT=3306
DB_NAME=electro_info_db
DB_USER=root
DB_PASS=tu_password

# Puerto del servidor
PORT=3000

# Entorno
NODE_ENV=development
```

3. **Configurar base de datos:**
```bash
# Solo crear tablas
npm run setup

# Solo poblar con datos de ejemplo
npm run seed

# Setup completo + inicio del servidor
npm run dev:full
```

## 📋 Scripts Disponibles

- `npm start` - Inicia el servidor en producción
- `npm run dev` - Inicia el servidor en modo desarrollo
- `npm run setup` - Crea la base de datos y todas las tablas
- `npm run seed` - Puebla la base de datos con datos de ejemplo
- `npm run dev:full` - Setup completo + inicia el servidor

## 🗄️ Base de Datos

### Requisitos
- MySQL 5.7+ o MySQL 8.0+
- Usuario con permisos para crear bases de datos

### Estructura de Tablas

El sistema automáticamente creará las siguientes tablas:

- **roles** - Roles de usuarios (Estudiante, Profesor, Administrativo)
- **careers** - Carreras universitarias
- **campuses** - Campus universitarios
- **borrowers** - Usuarios que pueden solicitar préstamos
- **books** - Libros disponibles en la biblioteca
- **loans** - Préstamos activos
- **invoices** - Historial de devoluciones

### Datos de Ejemplo

Al ejecutar el seeding, se crearán:
- 3 roles por defecto
- 5 carreras de ejemplo
- 3 campus
- 6 libros de ejemplo
- 4 usuarios de ejemplo

## 🔧 Desarrollo

### Estructura del Proyecto
```
├── app.js              # Servidor principal
├── config/             # Configuración de base de datos
├── models/             # Modelos de Sequelize
├── services/           # Lógica de negocio
├── scripts/            # Scripts de automatización
├── migrations/         # Migraciones (opcionales)
└── start.sh           # Script de inicio automático
```

### Sincronización Automática vs Migraciones

Este proyecto usa **sincronización automática** con `sequelize.sync()` que:
- ✅ Crea automáticamente todas las tablas basadas en los modelos
- ✅ Detecta cambios en los modelos y actualiza las tablas
- ✅ Es más simple y rápido para desarrollo

Si prefieres usar migraciones tradicionales:
```bash
npm run migrate
```

## 🌐 API Endpoints

El servidor estará disponible en `http://localhost:3000` una vez iniciado.

## ⚠️ Resolución de Problemas

### MySQL no está corriendo
```bash
# Ubuntu/Debian
sudo systemctl start mysql

# macOS
brew services start mysql

# Windows
net start mysql
```

### Error de conexión a la base de datos
1. Verifica las credenciales en el archivo `.env`
2. Asegúrate de que MySQL esté corriendo
3. Verifica que el usuario tenga permisos para crear bases de datos

### Reinstalar desde cero
```bash
# Eliminar node_modules y reinstalar
rm -rf node_modules package-lock.json
npm install

# Recrear base de datos (CUIDADO: elimina todos los datos)
npm run setup
```

## 📝 Notas

- El primer usuario creado tendrá permisos de administrador
- Los datos de ejemplo se pueden modificar en `scripts/seed-database.js`
- Para producción, cambiar `NODE_ENV=production` en `.env` 
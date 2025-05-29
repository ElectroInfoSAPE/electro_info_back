# Backend Sistema de Biblioteca

Este es el backend para el sistema de gestión de biblioteca, construido con Node.js, Express y Sequelize.

## Requisitos Previos

- Node.js (v14 o superior)
- MySQL (v5.7 o superior)
- npm (viene con Node.js)

## Pasos de Instalación y Ejecución

1. **Clonar el repositorio**
```bash
git clone <url-del-repositorio>
cd backend_electro_info
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**

Crear un archivo `.env` en la raíz del proyecto con el siguiente contenido:
```env
NODE_ENV=development
PORT=3000

# Database Configuration
DB_HOST=localhost
DB_USER=tu_usuario
DB_PASS=tu_contraseña
DB_NAME=library_db
DB_PORT=3306
```

> ⚠️ **Importante**: Reemplaza `tu_usuario` y `tu_contraseña` con tus credenciales de MySQL.

4. **Crear la base de datos**

Desde la línea de comandos de MySQL:
```bash
mysql -u tu_usuario -p
```

Una vez dentro de MySQL:
```sql
CREATE DATABASE library_db;
```

5. **Configurar la base de datos**

Ejecuta las migraciones para crear las tablas:
```bash
# Ejecutar todas las migraciones pendientes
npm run migrate

# Si necesitas poblar la base de datos con datos iniciales
npm run seed
```

6. **Iniciar el Servidor**

Para desarrollo (con hot reload):
```bash
npm run dev
```

Para producción:
```bash
npm start
```

El servidor estará corriendo en `http://localhost:3000`

## Verificar la Instalación

Para verificar que todo está funcionando correctamente:

1. Visita `http://localhost:3000/health`
2. Deberías recibir una respuesta JSON indicando que la conexión a la base de datos es exitosa

## Comandos de Base de Datos

- `npm run migrate`: Ejecuta las migraciones pendientes
- `npm run migrate:undo`: Revierte la última migración
- `npm run seed`: Ejecuta los seeders para poblar la base de datos con datos iniciales

## Comandos del Servidor

- `npm start`: Inicia el servidor en modo producción
- `npm run dev`: Inicia el servidor en modo desarrollo con hot reload

## Estructura del Proyecto

```
backend_electro_info/
├── config/
│   └── database_config.js    # Configuración de la base de datos
├── models/                   # Modelos Sequelize
│   ├── index.js
│   ├── book.model.js
│   ├── borrower.model.js
│   └── ...
├── services/                 # Lógica de negocio
│   ├── BaseService.js
│   ├── BookService.js
│   └── LoanService.js
├── migrations/              # Migraciones de la base de datos
├── seeders/                # Datos de prueba
├── .env                    # Variables de entorno
├── .sequelizerc           # Configuración de Sequelize CLI
├── app.js                 # Punto de entrada de la aplicación
└── package.json
```

## Solución de Problemas

Si encuentras errores durante la instalación o ejecución, verifica:

1. **Error de conexión a la base de datos**:
   - Asegúrate de que MySQL esté corriendo
   - Verifica que las credenciales en `.env` sean correctas
   - Confirma que la base de datos existe

2. **Error al ejecutar migraciones**:
   - Verifica que tienes permisos de escritura en la base de datos
   - Asegúrate de que la base de datos está creada
   - Comprueba que no hay errores en los archivos de migración

3. **El servidor no inicia**:
   - Verifica que todas las migraciones se ejecutaron correctamente
   - Comprueba que el puerto 3000 no esté en uso
   - Revisa los logs de error en la consola

## Notas Importantes

- No subir el archivo `.env` al control de versiones
- Siempre ejecutar las migraciones antes de iniciar el servidor
- Mantener las dependencias actualizadas
- Hacer backup de la base de datos regularmente
- En producción, usar variables de entorno seguras 
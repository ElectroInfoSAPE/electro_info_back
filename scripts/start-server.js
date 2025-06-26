#!/usr/bin/env node

require('dotenv').config();
const setupDatabase = require('./setup-database');
const seedDatabase = require('./seed-database');

async function startServer() {
  try {
    console.log('🔥 Iniciando servidor completo...\n');

    // 1. Configurar base de datos
    await setupDatabase();
    console.log('');

    // 2. Poblar con datos de ejemplo
    await seedDatabase();
    console.log('');

    // 3. Iniciar el servidor Express
    console.log('🚀 Iniciando servidor Express...');
    
    // ✅ CORREGIDO: Importar y iniciar el servidor correctamente
    const app = require('../app'); // Ahora apunta al verdadero app.js de Express
    
    const PORT = process.env.PORT;
    
    app.listen(PORT, () => {
      console.log(`🌟 Servidor corriendo en http://localhost:${PORT}`);
      console.log('📚 API endpoints disponibles:');
      console.log('  - GET    /api/health     - Estado de la API');
      console.log('  - GET    /api/books      - Obtener libros');
      console.log('  - POST   /api/books      - Crear libro');
      console.log('  - GET    /api/borrowers  - Obtener usuarios');
      console.log('  - POST   /api/borrowers  - Crear usuario');
      console.log('  - GET    /api/loans      - Obtener préstamos');
      console.log('  - GET    /api/stats      - Estadísticas');
      console.log('✅ Servidor listo para recibir peticiones');
    });

  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
    process.exit(1);
  }
}

startServer();
require('dotenv').config();
const mysql = require('mysql2/promise');
const { sequelize } = require('../models'); // Asegúrate de que apunte a models/index.js

async function setupDatabase() {
  try {
    console.log('🚀 Iniciando configuración de la base de datos...');

    // Validar variables de entorno requeridas
    const requiredEnvVars = ['DB_HOST', 'DB_USER', 'DB_PASS', 'DB_NAME'];
    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length > 0) {
      throw new Error(`❌ Variables de entorno faltantes: ${missingVars.join(', ')}`);
    }

    // Crear conexión sin especificar la base de datos para crearla
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER,
      password: process.env.DB_PASS
    });

    // Crear la base de datos si no existe
    const dbName = process.env.DB_NAME;
    await connection.execute(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
    console.log(`✅ Base de datos '${dbName}' creada o ya existe`);
    
    await connection.end();

    // Probar conexión con Sequelize
    await sequelize.authenticate();
    console.log('✅ Conexión a la base de datos establecida correctamente');

    // ✅ CORREGIDO: Usar sync más seguro
    console.log('📋 Sincronizando modelos con la base de datos...');
    
    // En desarrollo: sync normal
    // En producción: deberías usar migraciones
    if (process.env.NODE_ENV === 'production') {
      console.log('⚠️  En producción se recomienda usar migraciones en lugar de sync');
      await sequelize.sync({ force: false });
    } else {
      // Solo en desarrollo: alter para actualizar tablas existentes
      await sequelize.sync({ force: false, alter: false });
    }
    
    console.log('✅ Todas las tablas han sido creadas/actualizadas');

    // Verificar que todas las tablas esperadas existen
    const expectedTables = ['books', 'borrowers', 'campuses', 'careers', 'roles', 'loans', 'invoices'];
    const existingTables = await sequelize.getQueryInterface().showAllTables();
    
    const missingTables = expectedTables.filter(table => !existingTables.includes(table));
    
    if (missingTables.length > 0) {
      console.warn(`⚠️  Tablas faltantes: ${missingTables.join(', ')}`);
    } else {
      console.log('✅ Todas las tablas esperadas están presentes');
    }

    console.log('📊 Tablas en la base de datos:', existingTables);
    console.log('🎉 Configuración de base de datos completada exitosamente');
    
  } catch (error) {
    console.error('❌ Error durante la configuración:', error);
    
    // Información adicional para debugging
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('🔐 Error de acceso: Verificar credenciales de base de datos');
    } else if (error.code === 'ECONNREFUSED') {
      console.error('🔌 Error de conexión: Verificar que MySQL esté corriendo');
    }
    
    throw error;
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  setupDatabase()
    .then(() => {
      console.log('✅ Setup completado');
      process.exit(0);
    })
    .catch(error => {
      console.error('❌ Error en setup:', error);
      process.exit(1);
    });
}

module.exports = setupDatabase;
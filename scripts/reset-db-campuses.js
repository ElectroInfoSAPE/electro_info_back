const { sequelize } = require('../models');
const { Campus } = require('../models');

async function resetDatabaseWithCampuses() {
  try {
    console.log('🔄 Reiniciando base de datos...');
    
    // 1. Eliminar todas las tablas y recrearlas
    console.log('🗑️  Eliminando todas las tablas...');
    await sequelize.sync({ force: true });
    console.log('✅ Tablas eliminadas y recreadas');
    
    // 2. Crear solo datos en campuses
    console.log('🏛️  Creando campus...');
    
    const campuses = await Campus.bulkCreate([
      { name: 'Campus Central' },
      { name: 'Campus Norte' },
      { name: 'Campus Sur' },
      { name: 'Campus Este' },
      { name: 'Campus Oeste' }
    ]);
    
    console.log('✅ Campus creados exitosamente:');
    campuses.forEach(campus => {
      console.log(`   - ${campus.name} (ID: ${campus.id})`);
    });
    
    console.log('\n🎉 Base de datos reiniciada con éxito');
    console.log('📊 Solo campus creados, resto de tablas vacías');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error al reiniciar base de datos:', error.message);
    process.exit(1);
  }
}

resetDatabaseWithCampuses(); 
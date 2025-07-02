const { Campus } = require('../models');

async function createCampus() {
  try {
    console.log('🏛️  Verificando campus existentes...');
    
    const existingCampuses = await Campus.findAll();
    console.log(`📋 Campus existentes (${existingCampuses.length}):`);
    existingCampuses.forEach(campus => {
      console.log(`   - ${campus.name}`);
    });
    
    console.log('\n🏛️  Creando nuevo campus...');
    
    const campus = await Campus.create({
      name: 'Campus Nuevo'
    });
    
    console.log('✅ Campus creado exitosamente:');
    console.log(`   ID: ${campus.id}`);
    console.log(`   Nombre: ${campus.name}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error al crear campus:', error.message);
    if (error.errors) {
      error.errors.forEach(err => {
        console.error(`   - ${err.message}`);
      });
    }
    process.exit(1);
  }
}

createCampus(); 
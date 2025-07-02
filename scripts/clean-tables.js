const { 
  Book, 
  Borrower, 
  Loan, 
  Invoice, 
  Role, 
  Career 
} = require('../models');

async function cleanTables() {
  try {
    console.log('🧹 Limpiando tablas (excepto campuses)...');
    
    // Limpiar en orden correcto para evitar problemas de foreign keys
    // Primero las tablas que dependen de otras
    console.log('🧾 Limpiando facturas...');
    await Invoice.destroy({ where: {}, force: true });
    
    console.log('📋 Limpiando préstamos...');
    await Loan.destroy({ where: {}, force: true });
    
    console.log('📚 Limpiando libros...');
    await Book.destroy({ where: {}, force: true });
    
    console.log('👥 Limpiando usuarios...');
    await Borrower.destroy({ where: {}, force: true });
    
    console.log('🎭 Limpiando roles...');
    await Role.destroy({ where: {}, force: true });
    
    console.log('🎓 Limpiando carreras...');
    await Career.destroy({ where: {}, force: true });
    
    console.log('✅ Todas las tablas limpiadas exitosamente');
    console.log('🏛️  Campus se mantuvieron intactos');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error al limpiar tablas:', error.message);
    process.exit(1);
  }
}

cleanTables(); 
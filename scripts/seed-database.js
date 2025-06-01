require('dotenv').config();
const {
  sequelize,
  Role,
  Career,
  Campus,
  Book,
  Borrower,
  Loan
} = require('../models');

async function seedDatabase() {
  try {
    console.log('🌱 Iniciando seeding de la base de datos...');

    await sequelize.transaction(async (transaction) => {
      console.log('🧱 Borrando datos existentes...');
      await Promise.all([
        Loan.destroy({ where: {}, transaction }),
        Borrower.destroy({ where: {}, transaction }),
        Book.destroy({ where: {}, transaction }),
        Campus.destroy({ where: {}, transaction }),
        Career.destroy({ where: {}, transaction }),
        Role.destroy({ where: {}, transaction }),
      ]);

      console.log('🧩 Insertando datos base...');

      // Roles
      const roles = await Role.bulkCreate([
        { name: 'Estudiante' },
        { name: 'Profesor' },
        { name: 'Administrativo' }
      ], { transaction, returning: true });

      // Careers
      const careers = await Career.bulkCreate([
        { name: 'Ingeniería en Sistemas' },
        { name: 'Ingeniería Eléctrica' },
        { name: 'Ingeniería Mecánica' },
        { name: 'Administración' },
        { name: 'Contaduría' },
        { name: 'Ingeniería Industrial' },
        { name: 'Arquitectura' },
        { name: 'Medicina' },
        { name: 'Derecho' },
        { name: 'Psicología' }
      ], { transaction, returning: true });

      // Campus
      const campuses = await Campus.bulkCreate([
        { name: 'Campus Central' },
        { name: 'Campus Norte' },
        { name: 'Campus Sur' },
        { name: 'Campus Este' },
        { name: 'Campus Oeste' }
      ], { transaction, returning: true });

      // Books - 45 libros con autores
      const books = await Book.bulkCreate([
        // Ingeniería en Sistemas
        { name: 'Fundamentos de Programación', author: 'John Deitel', campus_id: campuses[0].id },
        { name: 'Estructura de Datos y Algoritmos', author: 'Robert Sedgewick', campus_id: campuses[0].id },
        { name: 'Sistemas Operativos Modernos', author: 'Andrew Tanenbaum', campus_id: campuses[0].id },
        { name: 'Redes de Computadoras', author: 'Andrew Tanenbaum', campus_id: campuses[0].id },
        { name: 'Ingeniería de Software', author: 'Ian Sommerville', campus_id: campuses[0].id },
        { name: 'Base de Datos Fundamentales', author: 'Abraham Silberschatz', campus_id: campuses[0].id },
        { name: 'Arquitectura de Computadoras', author: 'David Patterson', campus_id: campuses[0].id },
        { name: 'Programación Orientada a Objetos', author: 'Grady Booch', campus_id: campuses[0].id },
        
        // Ingeniería Eléctrica
        { name: 'Circuitos Eléctricos Básicos', author: 'Charles Alexander', campus_id: campuses[1].id },
        { name: 'Electromagnetismo', author: 'David Griffiths', campus_id: campuses[1].id },
        { name: 'Sistemas de Control', author: 'Norman Nise', campus_id: campuses[1].id },
        { name: 'Máquinas Eléctricas', author: 'Stephen Chapman', campus_id: campuses[1].id },
        { name: 'Análisis de Circuitos', author: 'Robert Boylestad', campus_id: campuses[1].id },
        { name: 'Electrónica Analógica', author: 'Thomas Floyd', campus_id: campuses[1].id },
        { name: 'Sistemas Digitales', author: 'Ronald Tocci', campus_id: campuses[1].id },
        
        // Matemáticas y Ciencias
        { name: 'Cálculo Diferencial e Integral', author: 'James Stewart', campus_id: campuses[2].id },
        { name: 'Álgebra Lineal', author: 'Gilbert Strang', campus_id: campuses[2].id },
        { name: 'Física General I', author: 'Raymond Serway', campus_id: campuses[2].id },
        { name: 'Física General II', author: 'Raymond Serway', campus_id: campuses[2].id },
        { name: 'Química General', author: 'Raymond Chang', campus_id: campuses[2].id },
        { name: 'Estadística y Probabilidad', author: 'Ronald Walpole', campus_id: campuses[2].id },
        { name: 'Ecuaciones Diferenciales', author: 'Dennis Zill', campus_id: campuses[2].id },
        
        // Administración y Negocios
        { name: 'Administración de Empresas', author: 'Stephen Robbins', campus_id: campuses[3].id },
        { name: 'Marketing Fundamentals', author: 'Philip Kotler', campus_id: campuses[3].id },
        { name: 'Contabilidad Financiera', author: 'Warren Reeve', campus_id: campuses[3].id },
        { name: 'Finanzas Corporativas', author: 'Ross Westerfield', campus_id: campuses[3].id },
        { name: 'Comportamiento Organizacional', author: 'Stephen Robbins', campus_id: campuses[3].id },
        { name: 'Gestión de Recursos Humanos', author: 'Gary Dessler', campus_id: campuses[3].id },
        { name: 'Estrategia Empresarial', author: 'Michael Porter', campus_id: campuses[3].id },
        
        // Ingeniería Mecánica
        { name: 'Mecánica de Materiales', author: 'Russell Hibbeler', campus_id: campuses[4].id },
        { name: 'Termodinámica', author: 'Yunus Cengel', campus_id: campuses[4].id },
        { name: 'Transferencia de Calor', author: 'Frank Incropera', campus_id: campuses[4].id },
        { name: 'Mecánica de Fluidos', author: 'Frank White', campus_id: campuses[4].id },
        { name: 'Diseño de Máquinas', author: 'Robert Norton', campus_id: campuses[4].id },
        { name: 'Resistencia de Materiales', author: 'Ferdinand Beer', campus_id: campuses[4].id },
        
        // Otros
        { name: 'Psicología General', author: 'David Myers', campus_id: campuses[0].id },
        { name: 'Derecho Constitucional', author: 'Luis López Guerra', campus_id: campuses[1].id },
        { name: 'Anatomía Humana', author: 'Frank Netter', campus_id: campuses[2].id },
        { name: 'Arquitectura Sostenible', author: 'Brian Edwards', campus_id: campuses[3].id },
        { name: 'Ingeniería Industrial', author: 'Niebel Freivalds', campus_id: campuses[4].id },
        { name: 'Historia Universal', author: 'Eric Hobsbawm', campus_id: campuses[0].id },
        { name: 'Filosofía Moderna', author: 'Bertrand Russell', campus_id: campuses[1].id },
        { name: 'Sociología Contemporánea', author: 'Anthony Giddens', campus_id: campuses[2].id },
        { name: 'Economía Política', author: 'Paul Samuelson', campus_id: campuses[3].id },
        { name: 'Metodología de la Investigación', author: 'Roberto Hernández', campus_id: campuses[4].id },
        { name: 'Ética Profesional', author: 'Adela Cortina', campus_id: campuses[0].id }
      ], { transaction, returning: true });

      // Borrowers - Más usuarios
      const borrowers = await Borrower.bulkCreate([
        { name: 'Juan Pérez', role_id: roles[0].id, career_id: careers[0].id },
        { name: 'María García', role_id: roles[0].id, career_id: careers[1].id },
        { name: 'Carlos Rodríguez', role_id: roles[0].id, career_id: careers[2].id },
        { name: 'Ana Martínez', role_id: roles[0].id, career_id: careers[3].id },
        { name: 'Luis Fernández', role_id: roles[0].id, career_id: careers[4].id },
        { name: 'Carmen López', role_id: roles[0].id, career_id: careers[5].id },
        { name: 'Pedro Sánchez', role_id: roles[0].id, career_id: careers[6].id },
        { name: 'Laura Jiménez', role_id: roles[0].id, career_id: careers[7].id },
        { name: 'Miguel Torres', role_id: roles[0].id, career_id: careers[8].id },
        { name: 'Isabel Ruiz', role_id: roles[0].id, career_id: careers[9].id },
        { name: 'Dr. Roberto Silva', role_id: roles[1].id, career_id: null },
        { name: 'Dra. Elena Morales', role_id: roles[1].id, career_id: null },
        { name: 'Prof. Antonio Vargas', role_id: roles[1].id, career_id: null },
        { name: 'Secretaria Mónica Cruz', role_id: roles[2].id, career_id: null },
        { name: 'Admin. Jorge Herrera', role_id: roles[2].id, career_id: null }
      ], { transaction, returning: true });

      // Loans - 22 préstamos: 11 vencidos y 11 actuales
      const currentDate = new Date();
      const overdueDays = 30; // Días de retraso para préstamos vencidos
      
      const loans = [];
      
      // 11 préstamos vencidos (primera mitad de los libros)
      for (let i = 0; i < 11; i++) {
        const retrievalDate = new Date();
        retrievalDate.setDate(currentDate.getDate() - (overdueDays + 14)); // Fecha de retiro hace más de 30+14 días
        
        const expectedDate = new Date(retrievalDate);
        expectedDate.setDate(retrievalDate.getDate() + 14); // 14 días de duración, ya vencido
        
        loans.push({
          borrower_id: borrowers[i % borrowers.length].id,
          book_id: books[i].id,
          retrieval_date: retrievalDate,
          devolution_expected_date: expectedDate
        });
      }
      
      // 11 préstamos actuales (no vencidos)
      for (let i = 11; i < 22; i++) {
        const retrievalDate = new Date();
        retrievalDate.setDate(currentDate.getDate() - 7); // Hace una semana
        
        const expectedDate = new Date(retrievalDate);
        expectedDate.setDate(retrievalDate.getDate() + 21); // 21 días de duración, aún vigente
        
        loans.push({
          borrower_id: borrowers[i % borrowers.length].id,
          book_id: books[i].id,
          retrieval_date: retrievalDate,
          devolution_expected_date: expectedDate
        });
      }

      await Loan.bulkCreate(loans, { transaction });

      console.log('✅ Datos insertados exitosamente.');
    });

    // Estadísticas
    const [r, c, cam, b, br, l] = await Promise.all([
      Role.count(),
      Career.count(),
      Campus.count(),
      Book.count(),
      Borrower.count(),
      Loan.count()
    ]);

    console.log('📊 Estadísticas:');
    console.log(`   Roles: ${r}`);
    console.log(`   Carreras: ${c}`);
    console.log(`   Campus: ${cam}`);
    console.log(`   Libros: ${b}`);
    console.log(`   Usuarios: ${br}`);
    console.log(`   Préstamos: ${l}`);
    console.log('   📚 11 préstamos vencidos y 11 vigentes');
    console.log('🎉 Seeding completo ✅');

  } catch (error) {
    console.error('❌ Error durante el seeding:', error);
    throw error;
  }
}

if (require.main === module) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

module.exports = seedDatabase;

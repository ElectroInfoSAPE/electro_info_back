const { Borrower, Request, Role, Career } = require('../models');

async function seedRequests() {
  try {
    // Asegurar que existe al menos un rol
    let role = await Role.findOne();
    if (!role) {
      role = await Role.create({ name: 'Estudiante' });
    }

    // Asegurar que existe al menos una carrera
    let career = await Career.findOne();
    if (!career) {
      career = await Career.create({ name: 'Ingeniería Informática' });
    }

    // Crear borrowers con career_id
    const borrowers = await Borrower.bulkCreate([
      { id: '00000011', name: 'Usuario 11', role_id: role.id, career_id: career.id },
      { id: '00000012', name: 'Usuario 12', role_id: role.id, career_id: career.id },
      { id: '00000013', name: 'Usuario 13', role_id: role.id, career_id: career.id },
      { id: '00000014', name: 'Usuario 14', role_id: role.id, career_id: career.id },
      { id: '00000015', name: 'Usuario 15', role_id: role.id, career_id: career.id }
    ], { ignoreDuplicates: true });

    console.log(`✅ ${borrowers.length} borrowers creados/verificados`);

    // Verificar requests existentes
    const existingRequests = await Request.findAll();
    console.log(`📊 Requests existentes: ${existingRequests.length}`);

    // Crear requests solo si no existen
    let createdRequests = 0;
    for (const borrower of borrowers) {
      try {
        const existingRequest = await Request.findOne({ where: { borrower_id: borrower.id } });
        if (!existingRequest) {
          await Request.create({ borrower_id: borrower.id });
          createdRequests++;
          console.log(`✅ Request creado para borrower ${borrower.id}`);
        } else {
          console.log(`⏭️  Request ya existe para borrower ${borrower.id}`);
        }
      } catch (error) {
        console.error(`❌ Error creando request para borrower ${borrower.id}:`, error.message);
      }
    }

    console.log(`✅ ${createdRequests} nuevos requests creados exitosamente`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error al crear borrowers o requests:', error.message);
    if (error.errors) {
      error.errors.forEach(err => {
        console.error(`  - ${err.message} (${err.path})`);
      });
    }
    process.exit(1);
  }
}

seedRequests(); 
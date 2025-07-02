// app.js - Servidor Express
'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./models'); // Tu configuración de base de datos

const app = express();

// Configuración específica de CORS
const corsOptions = {
  origin: function (origin, callback) {
    // Lista de orígenes permitidos
    const allowedOrigins = [
      'http://localhost:3000',     // Tu backend
      'http://localhost:3001',     // React por defecto
      'http://localhost:5173',     // Vite por defecto
      'http://localhost:8080',     // Vue CLI por defecto
      'http://localhost:4200',     // Angular por defecto
      'http://localhost', 
      'http://127.0.0.1:3001',    // Alternativa localhost
      'http://127.0.0.1:5173',    // Alternativa localhost
      'http://127.0.0.1:8080',    // Alternativa localhost
      'http://127.0.0.1:4200',    // Alternativa localhost
      'http://172.31.92.36',      // IP específica
      'http://172.31.92.36:3000', // IP con puerto 3000
      'http://172.31.92.36:3001', // IP con puerto 3001
      'http://172.31.92.36:5173', // IP con puerto 5173
      'http://172.31.92.36:8080', // IP con puerto 8080
      'http://172.31.92.36:5173', // IP con puerto 4200
      // Agrega aquí el puerto específico que necesites
      // 'http://localhost:PUERTO_ESPECIFICO'
    ];

    // Permitir requests sin origin (como Postman, curl, etc.)
    if (!origin) return callback(null, true);
    
    // Verificar si el origin está en la lista de permitidos
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('CORS bloqueado para:', origin);
      callback(new Error('No permitido por CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true, // Permite cookies y headers de autenticación
  optionsSuccessStatus: 200 // Para compatibilidad con navegadores antiguos
};

// Middleware global
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware de logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// ===== RUTAS DE LA API =====

// Ruta de salud de la API
app.get('/api/health', async (req, res) => {
  try {
    await db.sequelize.authenticate();
    
    res.json({
      success: true,
      message: 'API funcionando correctamente',
      database: 'Conectada',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error en la API',
      error: error.message
    });
  }
});

// ===== RUTAS DE LIBROS =====
app.get('/api/books', async (req, res) => {
  try {
    const books = await db.Book.findAll({
      include: [
        {
          model: db.Campus,
          attributes: ['name']
        }
      ]
    });
    
    res.json({
      success: true,
      count: books.length,
      data: books
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener libros',
      error: error.message
    });
  }
});

app.get('/api/books/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const book = await db.Book.findByPk(id, {
      include: [
        {
          model: db.Campus,
          attributes: ['name']
        }
      ]
    });

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Libro no encontrado'
      });
    }

    res.json({
      success: true,
      data: book
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener libro',
      error: error.message
    });
  }
});

app.post('/api/books', async (req, res) => {
  try {
    const { id, name, author, campus } = req.body;

    if (!id || !name || !author || !campus) {
      return res.status(400).json({
        success: false,
        message: 'ID, nombre, autor y campus son requeridos'
      });
    }

    // Verificar que el ID no esté duplicado
    const existingBook = await db.Book.findByPk(id);
    if (existingBook) {
      return res.status(400).json({
        success: false,
        message: 'Ya existe un libro con ese ID'
      });
    }

    // Buscar el campus por nombre
    const campusRecord = await db.Campus.findOne({
      where: { name: campus }
    });
    
    if (!campusRecord) {
      return res.status(400).json({
        success: false,
        message: 'Campus no encontrado. Campus disponibles: ' + 
          (await db.Campus.findAll()).map(c => c.name).join(', ')
      });
    }

    const newBook = await db.Book.create({
      id,
      name,
      author,
      campus_id: campusRecord.id
    });

    res.status(201).json({
      success: true,
      message: 'Libro creado exitosamente',
      data: newBook
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al crear libro',
      error: error.message
    });
  }
});

app.delete('/api/books/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar que el libro existe
    const book = await db.Book.findByPk(id);
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Libro no encontrado'
      });
    }

    // Verificar que el libro no esté prestado
    const activeLoan = await db.Loan.findOne({
      where: { book_id: id }
    });

    if (activeLoan) {
      return res.status(400).json({
        success: false,
        message: 'No se puede eliminar el libro porque está prestado'
      });
    }

    // Eliminar el libro
    await db.Book.destroy({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Libro eliminado exitosamente',
      data: book
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al eliminar libro',
      error: error.message
    });
  }
});

// ===== RUTAS DE USUARIOS/BORROWERS =====
app.get('/api/borrowers', async (req, res) => {
  try {
    const borrowers = await db.Borrower.findAll({
      include: [
        {
          model: db.Role,
          attributes: ['name']
        },
        {
          model: db.Career,
          attributes: ['name'],
          required: false // LEFT JOIN porque career_id puede ser null
        }
      ]
    });
    
    res.json({
      success: true,
      count: borrowers.length,
      data: borrowers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener usuarios',
      error: error.message
    });
  }
});

app.post('/api/borrowers', async (req, res) => {
  try {
    const { name, role_id, career_id } = req.body;

    if (!name || !role_id) {
      return res.status(400).json({
        success: false,
        message: 'Nombre y role_id son requeridos'
      });
    }

    // Verificar que existe el rol
    const role = await db.Role.findByPk(role_id);
    if (!role) {
      return res.status(400).json({
        success: false,
        message: 'Rol no válido'
      });
    }

    // Si se proporciona career_id, verificar que existe
    if (career_id) {
      const career = await db.Career.findByPk(career_id);
      if (!career) {
        return res.status(400).json({
          success: false,
          message: 'Carrera no válida'
        });
      }
    }

    const newBorrower = await db.Borrower.create({
      name,
      role_id,
      career_id: career_id || null
    });

    res.status(201).json({
      success: true,
      message: 'Usuario creado exitosamente',
      data: newBorrower
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al crear usuario',
      error: error.message
    });
  }
});

// ===== RUTAS DE PRÉSTAMOS =====
app.get('/api/loans', async (req, res) => {
  try {
    const loans = await db.Loan.findAll({
      include: [
        {
          model: db.Borrower,
          attributes: ['name'],
          include: [
            {
              model: db.Role,
              attributes: ['name']
            }
          ]
        },
        {
          model: db.Book,
          attributes: ['name'],
          include: [
            {
              model: db.Campus,
              attributes: ['name']
            }
          ]
        }
      ]
    });
    
    res.json({
      success: true,
      count: loans.length,
      data: loans
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener préstamos',
      error: error.message
    });
  }
});

app.post('/api/loans', async (req, res) => {
  try {
    const { barcode, usuarioId, duracionDias } = req.body;

    // Validaciones básicas
    if (!barcode || !usuarioId || !duracionDias) {
      return res.status(400).json({
        success: false,
        message: 'barcode, usuarioId y duracionDias son requeridos'
      });
    }

    if (duracionDias <= 0 || duracionDias > 365) {
      return res.status(400).json({
        success: false,
        message: 'duracionDias debe ser entre 1 y 365 días'
      });
    }

    // Verificar que existe el libro usando barcode
    const book = await db.Book.findByPk(barcode, {
      include: [
        {
          model: db.Campus,
          attributes: ['name']
        }
      ]
    });
    
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Libro no encontrado con el código de barras proporcionado'
      });
    }

    // Verificar que existe el usuario/borrower
    const borrower = await db.Borrower.findByPk(usuarioId);
    if (!borrower) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    // Verificar que el libro no esté ya prestado
    const existingLoan = await db.Loan.findOne({
      where: { book_id: barcode }
    });

    if (existingLoan) {
      return res.status(400).json({
        success: false,
        message: 'El libro ya está prestado'
      });
    }

    // Calcular fechas
    const retrievalDate = new Date();
    const devolutionExpectedDate = new Date();
    devolutionExpectedDate.setDate(retrievalDate.getDate() + parseInt(duracionDias));

    // Crear el préstamo
    const newLoan = await db.Loan.create({
      borrower_id: usuarioId,
      book_id: barcode,
      retrieval_date: retrievalDate,
      devolution_expected_date: devolutionExpectedDate
    });

    // Preparar la respuesta según la interface MakeLoanResponse
    const response = {
      success: true,
      message: 'Préstamo creado exitosamente',
      libro: book,
      usuarioId: usuarioId,
      duracionDias: duracionDias,
      barcode: barcode,
      fecha: retrievalDate.toISOString()
    };

    res.status(201).json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al crear préstamo',
      error: error.message
    });
  }
});

// Nuevo endpoint para devolver préstamo por book_id
app.post('/api/loans/devolver', async (req, res) => {
  try {
    const { book_id } = req.body;
    if (!book_id) {
      return res.status(400).json({
        success: false,
        message: 'book_id es requerido'
      });
    }

    // Buscar el préstamo activo por book_id
    const loan = await db.Loan.findOne({
      where: { book_id },
      include: [
        {
          model: db.Borrower,
          attributes: ['name'],
          include: [
            { model: db.Role, attributes: ['name'] }
          ]
        },
        {
          model: db.Book,
          attributes: ['name'],
          include: [
            { model: db.Campus, attributes: ['name'] }
          ]
        }
      ]
    });

    if (!loan) {
      return res.status(404).json({
        success: false,
        message: 'Préstamo no encontrado para ese book_id'
      });
    }

    // Eliminar el préstamo
    await db.Loan.destroy({ where: { id: loan.id } });

    // Calcular si fue devuelto a tiempo
    const fechaDevolucion = new Date();
    const fueDevueltoATiempo = fechaDevolucion <= new Date(loan.devolution_expected_date);

    // Crear la invoice asociada a la devolución
    await db.Invoice.create({
      borrower_id: loan.borrower_id,
      book_id: loan.book_id,
      retrieval_date: loan.retrieval_date,
      devolution_expected_date: loan.devolution_expected_date,
      devolution_date: fechaDevolucion
    });

    res.json({
      success: true,
      message: 'Préstamo devuelto exitosamente',
      data: {
        prestamo: loan,
        devolucion: {
          fechaDevolucion: fechaDevolucion,
          fechaEsperada: loan.devolution_expected_date,
          devueltoATiempo: fueDevueltoATiempo,
          diasRetraso: fueDevueltoATiempo ? 0 : Math.ceil((fechaDevolucion - new Date(loan.devolution_expected_date)) / (1000 * 60 * 60 * 24))
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al devolver préstamo',
      error: error.message
    });
  }
});

// ===== RUTAS DE CATÁLOGOS =====
app.get('/api/campuses', async (req, res) => {
  try {
    const campuses = await db.Campus.findAll();
    res.json({ success: true, data: campuses });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener campus',
      error: error.message
    });
  }
});

app.get('/api/roles', async (req, res) => {
  try {
    const roles = await db.Role.findAll();
    res.json({ success: true, data: roles });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener roles',
      error: error.message
    });
  }
});

app.get('/api/careers', async (req, res) => {
  try {
    const careers = await db.Career.findAll();
    res.json({ success: true, data: careers });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener carreras',
      error: error.message
    });
  }
});

// ===== RUTAS DE FACTURAS (INVOICES) =====
app.get('/api/invoices', async (req, res) => {
  try {
    const invoices = await db.Invoice.findAll({
      include: [
        {
          model: db.Borrower,
          attributes: ['name']
        },
        {
          model: db.Book,
          attributes: ['name']
        }
      ]
    });
    res.json({
      success: true,
      count: invoices.length,
      data: invoices
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener facturas',
      error: error.message
    });
  }
});

// ===== RUTA DE ESTADÍSTICAS =====
app.get('/api/stats', async (req, res) => {
  try {
    const stats = {
      books: await db.Book.count(),
      borrowers: await db.Borrower.count(),
      campuses: await db.Campus.count(),
      careers: await db.Career.count(),
      roles: await db.Role.count(),
      loans: await db.Loan.count(),
      invoices: await db.Invoice.count()
    };
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener estadísticas',
      error: error.message
    });
  }
});

// Endpoint para obtener todos los requests
app.get('/api/requests', async (req, res) => {
  try {
    const requests = await db.Request.findAll({
      include: [{
        model: db.Borrower,
        attributes: ['id', 'name']
      }]
    });
    const data = requests.map(r => ({
      id: r.id,
      borrower_id: r.Borrower?.id,
      borrower_name: r.Borrower?.name
    }));
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al obtener requests', error: error.message });
  }
});

// Endpoint para crear un request y programar su borrado automático
app.post('/api/requests', async (req, res) => {
  try {
    const { borrower_id } = req.body;
    if (!borrower_id) {
      return res.status(400).json({ success: false, message: 'borrower_id es requerido' });
    }
    const newRequest = await db.Request.create({ borrower_id });
    // Programar borrado automáticamente en 30 segundos
    setTimeout(async () => {
      try {
        await db.Request.destroy({ where: { id: newRequest.id } });
        console.log(`Request con id ${newRequest.id} eliminado automáticamente después de 30 segundos.`);
      } catch (err) {
        console.error('Error al borrar request automáticamente:', err.message);
      }
    }, 30000);
    res.status(201).json({ success: true, data: newRequest });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al crear request', error: error.message });
  }
});

// ===== MIDDLEWARE DE ERROR =====

// Ruta no encontrada
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada',
    availableEndpoints: [
      'GET /api/health',
      'GET /api/books',
      'POST /api/books',
      'GET /api/books/:id',
      'DELETE /api/books/:id',
      'GET /api/borrowers',
      'POST /api/borrowers',
      'GET /api/loans',
      'POST /api/loans',
      'POST /api/loans/devolver',
      'GET /api/campuses',
      'GET /api/roles',
      'GET /api/careers',
      'GET /api/invoices',
      'GET /api/stats',
      'GET /api/requests',
      'POST /api/requests'
    ]
  });
});

// Manejo de errores global
app.use((error, req, res, next) => {
  console.error('Error global:', error);
  
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});


module.exports = app;
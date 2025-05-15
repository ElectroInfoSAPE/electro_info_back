import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { sequelize } from './models';
import libroRoutes from './routes/libroRoutes';
import prestamoRoutes from './routes/prestamoRoutes';
import usuarioRoutes from './routes/usuarioRoutes';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/libros', libroRoutes);
app.use('/api/prestamos', prestamoRoutes);
app.use('/api/usuarios', usuarioRoutes);

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor'
  });
});

// Inicializar base de datos y servidor
const initServer = async () => {
  try {
    // Sincronizar modelos con la base de datos
    await sequelize.sync();
    console.log('Base de datos sincronizada');

    // Iniciar servidor
    app.listen(port, () => {
      console.log(`Servidor corriendo en el puerto ${port}`);
    });
  } catch (error) {
    console.error('Error al inicializar el servidor:', error);
    process.exit(1);
  }
};

initServer(); 
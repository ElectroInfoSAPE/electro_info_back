import { Sequelize } from 'sequelize';
import config from '../config/database.config';
import Libro from './libro.model';
import Usuario from './usuario.model';
import Prestamo from './prestamo.model';

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env as keyof typeof config];

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: dbConfig.dialect,
    dialectModule: dbConfig.dialectModule,
    define: dbConfig.define,
    logging: dbConfig.logging
  }
);

// Inicializar modelos
const models = {
  Libro: Libro.initModel(sequelize),
  Usuario: Usuario.initModel(sequelize),
  Prestamo: Prestamo.initModel(sequelize)
};

// Configurar asociaciones
Prestamo.associate();

export { sequelize };
export default models; 
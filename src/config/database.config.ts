import { Dialect } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

interface DatabaseConfig {
  database: string;
  username: string;
  password: string;
  host: string;
  port: number;
  dialect: Dialect;
  dialectModule: any;
  define: {
    charset: string;
    collate: string;
    timestamps: boolean;
  };
  logging: boolean | ((sql: string, timing?: number) => void);
}

interface Config {
  development: DatabaseConfig;
  test?: DatabaseConfig;
  production?: DatabaseConfig;
}

const config: Config = {
  development: {
    database: process.env.DB_NAME || 'biblioteca',
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    dialect: 'mysql',
    dialectModule: require('mysql2'),
    define: {
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci',
      timestamps: true
    },
    logging: process.env.NODE_ENV === 'development' ? console.log : false
  }
};

export default config; 
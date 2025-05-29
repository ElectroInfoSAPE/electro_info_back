'use strict';

const fs = require('fs');
const path = require('path');
const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/database_config.js')[env];

if (!config) {
    throw new Error(`No database configuration found for environment: ${env}`);
}

const sequelize = config.use_env_variable
    ? new Sequelize(process.env[config.use_env_variable], config)
    : new Sequelize(
        config.database,
        config.username,
        config.password,
        {
            host: config.host,
            port: config.port || 3306,
            dialect: config.dialect || 'mysql',
            dialectModule: config.dialectModule || require('mysql2'),
            logging: false,
            ...config,
        }
    );

const db = {};

// Cargar todos los modelos automáticamente
fs.readdirSync(__dirname)
    .filter(file => file.endsWith('.js') && file !== basename)
    .forEach(file => {
        const model = require(path.join(__dirname, file))(sequelize, DataTypes);
        db[model.name] = model;
    });

// Asociaciones entre modelos si existen
Object.keys(db).forEach(modelName => {
    if (typeof db[modelName].associate === 'function') {
        db[modelName].associate(db);
    }
});

// Método opcional para testear conexión
db.testConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Database connection successful');
        return true;
    } catch (error) {
        console.error('❌ Database connection error:', error);
        return false;
    }
};

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;

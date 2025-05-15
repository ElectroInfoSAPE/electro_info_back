import { Model, DataTypes, Sequelize } from 'sequelize';
import { LibroUbicacion } from '../types';

interface LibroAttributes {
  id: string;
  codigo: string;
  titulo: string;
  autor: string;
  isbn: string;
  disponible: boolean;
  editorial?: string;
  anioPublicacion?: number;
  genero?: string;
  disponibles: number;
  imagen?: string;
  descripcion?: string;
  ubicacion: LibroUbicacion;
}

class Libro extends Model<LibroAttributes> implements LibroAttributes {
  public id!: string;
  public codigo!: string;
  public titulo!: string;
  public autor!: string;
  public isbn!: string;
  public disponible!: boolean;
  public editorial!: string;
  public anioPublicacion!: number;
  public genero!: string;
  public disponibles!: number;
  public imagen!: string;
  public descripcion!: string;
  public ubicacion!: LibroUbicacion;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  static initModel(sequelize: Sequelize): typeof Libro {
    Libro.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true
        },
        codigo: {
          type: DataTypes.STRING(50),
          unique: true,
          allowNull: false
        },
        titulo: {
          type: DataTypes.STRING(255),
          allowNull: false
        },
        autor: {
          type: DataTypes.STRING(255),
          allowNull: false
        },
        isbn: {
          type: DataTypes.STRING(13),
          unique: true,
          allowNull: false
        },
        disponible: {
          type: DataTypes.BOOLEAN,
          defaultValue: true
        },
        editorial: {
          type: DataTypes.STRING(255),
          allowNull: true
        },
        anioPublicacion: {
          type: DataTypes.INTEGER,
          allowNull: true
        },
        genero: {
          type: DataTypes.STRING(100),
          allowNull: true
        },
        disponibles: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 1
        },
        imagen: {
          type: DataTypes.STRING(255),
          allowNull: true
        },
        descripcion: {
          type: DataTypes.TEXT,
          allowNull: true
        },
        ubicacion: {
          type: DataTypes.ENUM(...Object.values(LibroUbicacion)),
          allowNull: false
        }
      },
      {
        sequelize,
        tableName: 'libros',
        timestamps: true
      }
    );

    return Libro;
  }
}

export default Libro; 
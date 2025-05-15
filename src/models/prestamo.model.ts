import { Model, DataTypes, Sequelize } from 'sequelize';
import { PrestamoEstado } from '../types';
import Libro from './libro.model';
import Usuario from './usuario.model';

interface PrestamoAttributes {
  id: string;
  libroId: string;
  usuarioId: string;
  usuarioNombre: string;
  fechaPrestamo: string;
  LibroNombre: string;
  fechaDevolucionPrevista: string;
  fechaDevolucionReal?: string;
  estado: PrestamoEstado;
  renovaciones_hechas: number;
  diasRetraso?: number;
  notas?: string;
  autor: string;
}

class Prestamo extends Model<PrestamoAttributes> implements PrestamoAttributes {
  public id!: string;
  public libroId!: string;
  public usuarioId!: string;
  public usuarioNombre!: string;
  public fechaPrestamo!: string;
  public LibroNombre!: string;
  public fechaDevolucionPrevista!: string;
  public fechaDevolucionReal!: string;
  public estado!: PrestamoEstado;
  public renovaciones_hechas!: number;
  public diasRetraso!: number;
  public notas!: string;
  public autor!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  static initModel(sequelize: Sequelize): typeof Prestamo {
    Prestamo.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true
        },
        libroId: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: 'libros',
            key: 'id'
          }
        },
        usuarioId: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: 'usuarios',
            key: 'id'
          }
        },
        usuarioNombre: {
          type: DataTypes.STRING(255),
          allowNull: false
        },
        fechaPrestamo: {
          type: DataTypes.DATEONLY,
          allowNull: false,
          defaultValue: DataTypes.NOW
        },
        LibroNombre: {
          type: DataTypes.STRING(255),
          allowNull: false
        },
        fechaDevolucionPrevista: {
          type: DataTypes.DATEONLY,
          allowNull: false
        },
        fechaDevolucionReal: {
          type: DataTypes.DATEONLY,
          allowNull: true
        },
        estado: {
          type: DataTypes.ENUM(...Object.values(PrestamoEstado)),
          allowNull: false,
          defaultValue: PrestamoEstado.ACTIVO
        },
        renovaciones_hechas: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0
        },
        diasRetraso: {
          type: DataTypes.INTEGER,
          allowNull: true
        },
        notas: {
          type: DataTypes.TEXT,
          allowNull: true
        },
        autor: {
          type: DataTypes.STRING(255),
          allowNull: false
        }
      },
      {
        sequelize,
        tableName: 'prestamos',
        timestamps: true
      }
    );

    return Prestamo;
  }

  static associate() {
    Prestamo.belongsTo(Libro, { foreignKey: 'libroId' });
    Prestamo.belongsTo(Usuario, { foreignKey: 'usuarioId' });
  }
}

export default Prestamo; 
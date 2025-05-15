import { Model, DataTypes, Sequelize } from 'sequelize';
import { UsuarioRol, UsuarioEstado } from '../types';

interface UsuarioAttributes {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  idTarjetaAustral: string;
  rol: UsuarioRol;
  estado: UsuarioEstado;
  fechaRegistro: string;
  carrera?: string;
  departamento?: string;
  limitePrestamos: number;
}

class Usuario extends Model<UsuarioAttributes> implements UsuarioAttributes {
  public id!: string;
  public nombre!: string;
  public apellido!: string;
  public email!: string;
  public idTarjetaAustral!: string;
  public rol!: UsuarioRol;
  public estado!: UsuarioEstado;
  public fechaRegistro!: string;
  public carrera!: string;
  public departamento!: string;
  public limitePrestamos!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  static initModel(sequelize: Sequelize): typeof Usuario {
    Usuario.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true
        },
        nombre: {
          type: DataTypes.STRING(100),
          allowNull: false
        },
        apellido: {
          type: DataTypes.STRING(100),
          allowNull: false
        },
        email: {
          type: DataTypes.STRING(255),
          allowNull: false,
          unique: true,
          validate: {
            isEmail: true
          }
        },
        idTarjetaAustral: {
          type: DataTypes.STRING(50),
          allowNull: false,
          unique: true
        },
        rol: {
          type: DataTypes.ENUM(...Object.values(UsuarioRol)),
          allowNull: false
        },
        estado: {
          type: DataTypes.ENUM(...Object.values(UsuarioEstado)),
          allowNull: false,
          defaultValue: UsuarioEstado.ACTIVO
        },
        fechaRegistro: {
          type: DataTypes.DATEONLY,
          allowNull: false,
          defaultValue: DataTypes.NOW
        },
        carrera: {
          type: DataTypes.STRING(100),
          allowNull: true
        },
        departamento: {
          type: DataTypes.STRING(100),
          allowNull: true
        },
        limitePrestamos: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 5
        }
      },
      {
        sequelize,
        tableName: 'usuarios',
        timestamps: true
      }
    );

    return Usuario;
  }
}

export default Usuario; 
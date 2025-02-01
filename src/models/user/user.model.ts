import bcrypt from 'bcrypt';
import sha256 from 'sha256';

import { DataTypes, Model, Sequelize } from 'sequelize';
import { ROLE, ROLE_ENUM } from '../../types/role.type';
import config from '../../config';
import { TUser } from '../../types/user/user.type';

const { PASSWORD_HASH_SALT } = config;
const salt = bcrypt.genSaltSync(PASSWORD_HASH_SALT);

const _hashPassword = async (password) => {
  const hashPassword = sha256(password);
  const bcryptPassword = await bcrypt.hash(hashPassword, salt);
  return bcryptPassword;
};

export class UserModel extends Model implements TUser {
  public id!: string;
  public password!: string;
  public phoneNumber!: string;
  public email!: string;
  public role!: ROLE;

  static associate() {}
}

export const createUserModel = (sequelize: Sequelize) => {
  UserModel.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      },
      phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false
      },
      role: {
        type: DataTypes.ENUM,
        values: ROLE_ENUM,
        allowNull: false
      }
    },
    {
      sequelize,
      modelName: 'UserModel',
      tableName: 'Users',
      timestamps: true
    }
  );
  UserModel.beforeCreate(async (user) => {
    if (user.password) {
      const hashedPassword = await _hashPassword(user.password);
      user.password = hashedPassword;
    }
  });

  UserModel.beforeUpdate(async (user) => {
    if (user.password) {
      const hashedPassword = await _hashPassword(user.password);
      user.password = hashedPassword;
    }
  });
};

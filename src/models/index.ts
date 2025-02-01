import { Sequelize } from 'sequelize';

import { UserModel, createUserModel } from './user/user.model';

export const setupModel = (sequelize: Sequelize) => {
  createUserModel(sequelize);

  UserModel.associate();
};

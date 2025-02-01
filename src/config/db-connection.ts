import { Sequelize, Options } from 'sequelize';
import config from '.';
import { setupModel } from '../models';

const {
  POSTGRES_DB_USERNAME,
  POSTGRES_DB_HOST,
  POSTGRES_DB_PORT,
  POSTGRES_DB_PASSWORD,
  POSTGRES_DB_NAME
} = config;

const options: Options = {
  username: POSTGRES_DB_USERNAME,
  password: POSTGRES_DB_PASSWORD,
  database: POSTGRES_DB_NAME,
  port: POSTGRES_DB_PORT as unknown as number,
  dialect: 'postgres',
  host: POSTGRES_DB_HOST,
  timezone: '+08:00',
  logging: false
};
const sequelize = new Sequelize(options);
setupModel(sequelize);
export default sequelize;

export const connectDatabase = async () => {
  await sequelize
    .authenticate()
    .then(async () => {
      await sequelize.sync({
        alter: true,
        logging: false,
        force: false
      });
      console.log('Database successfully connected 😸');
    })
    .catch((err) => {
      throw new Error(`Database connection error ${err.message} 😿`);
    });
};

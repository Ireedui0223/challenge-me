import 'dotenv/config';

export default {
  PORT: process.env.PORT || 8080,
  POSTGRES_DB_NAME: process.env.POSTGRES_DB_NAME || '',
  POSTGRES_DB_USERNAME: process.env.POSTGRES_DB_USERNAME || '',
  POSTGRES_DB_HOST: process.env.POSTGRES_DB_HOST || '',
  POSTGRES_DB_PORT: process.env.POSTGRES_DB_PORT || 5432,
  POSTGRES_DB_PASSWORD: process.env.POSTGRES_DB_PASSWORD || '',
  JWT_TOKEN_SALT: process.env.JWT_TOKEN_SALT || '',
  PASSWORD_HASH_SALT: parseInt(process.env.PASSWORD_HASH_SALT || '0')
};

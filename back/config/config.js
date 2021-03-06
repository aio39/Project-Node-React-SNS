const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  development: {
    username: 'root',
    password: process.env.MYSQL_DEV_PASSWORD,
    database: process.env.MYSQL_DEV_DB,
    host: process.env.MYSQL_DEV_HOST,
    port: process.env.MYSQL_DEV_PORT,
    dialect: 'mysql',
  },
  test: {
    username: 'root',
    password: process.env.MYSQL_DB_PASSWORD,
    database: 'node-project',
    host: '127.0.0.1',
    dialect: 'mysql',
  },
  production: {
    username: 'root',
    password: process.env.MYSQL_PROD_PASSWORD,
    database: process.env.MYSQL_PROD_DB,
    host: process.env.MYSQL_PROD_HOST,
    port: process.env.MYSQL_PROD_PORT,
    dialect: 'mysql',
  },
};

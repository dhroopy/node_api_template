// Get logger from external configuration source
const winstonConfig = require('../../config/winston-config');

let defaultLogger = winstonConfig.defaultLogger;
const mysql = require('mysql');

const pool = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
});

pool.query('SELECT 1 + 1 AS solution', function (error, results) {
  if (error) {
    defaultLogger.error('Database connection failed', error);
    throw error;
  }
  console.log('The solution is: ', results[0].solution);
  defaultLogger.info('MySql Connected!...');
  defaultLogger.info(`Database: ${process.env.DATABASE_NAME}`);
});

let query = (sql, values = []) => {
  defaultLogger.info(`Executing query: sql:${sql}, values: ${values}`);
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        defaultLogger.error('Database connection failed', err);
        reject(err);
      } else {
        connection.query(sql, values, (err, rows) => {
          if (err) {
            defaultLogger.error(
              `Query @sql: ${sql} failed with @error: ${err}`,
            );
            reject(err);
          } else {
            resolve(rows);
          }
          connection.release();
        });
      }
    });
  });
};

module.exports = query;

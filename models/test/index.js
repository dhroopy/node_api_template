const query = require('../../loaders/database/connection');
//require winston
const winston = require('winston');
// Get logger from external configuration source
const winstonConfig = require('../../config/winston-config');

let defaultLogger = winstonConfig.defaultLogger;

const MODULE = 'test-model';
// Add another logger with the category specific to this module
winston.loggers.add(MODULE, winstonConfig.createLoggerConfig(MODULE));
// Module-specific logger
const moduleLogger = winston.loggers.get(MODULE);

//export function
module.exports = {
  testModel: (data) => {
    defaultLogger.info(`in test-model`);
    moduleLogger.info(`testModel() @params: ${JSON.stringify(data)}`);
    const sql = 'SELECT * FROM user_master WHERE username = ?';
    const values = [data.username];
    return query(sql, values);
  },
  fetchCompany: (data) => {
    const sql = 'SELECT * From company_master where comp_id = ?';
    const values = [data.comp_id];
    return query(sql, values);
  },
  imageUploadTest: (data) => {
    return ['Image path inserted into database', data];
  },
};

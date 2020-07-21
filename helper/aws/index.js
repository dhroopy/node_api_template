const s3 = require('../../config/awsS3-config');

// LOGGERS ->
//require winston
const winston = require('winston');
// Get logger from external configuration source
const winstonConfig = require('../../config/winston-config');

let defaultLogger = winstonConfig.defaultLogger;

const MODULE = 'aws-helper';
// Add another logger with the category specific to this module
winston.loggers.add(MODULE, winstonConfig.createLoggerConfig(MODULE));
// Module-specific logger
const moduleLogger = winston.loggers.get(MODULE);
// LOGGERS <-

module.exports = {
  sendFile: async (key, data) => {
    defaultLogger.info('In aws-helper');
    moduleLogger.info(`sendFile() called to upload file ${key} to s3 bucket`);
    /**
     * @param {String} key name of image
     * @param {Buffer} data buffer data of image = req.file.buffer
     * @returns error of data of uploaded image
     */
    // check if both key and data are present
    if (
      key === null ||
      key === undefined ||
      key === '' ||
      data === null ||
      data === undefined
    ) {
      // construct an error
      const error = new Error();
      error.status = 500;
      error.message = 'Bad Parameters';
      //log error
      defaultLogger.error('aws-helper error');
      moduleLogger.error(`Cannot upload file ${key} to s3 ERROR: ${error}`);
      throw error;
    }
    //construct options
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
      Body: data,
    };
    //wrap in promise
    return new Promise((resolve, reject) => {
      //call upload function
      s3.upload(params, function (err, data) {
        if (err) {
          //handle and log error
          moduleLogger.error(`Error in file uploading ERROR: ${err}`);
          return reject('File Upload Failed');
        }
        if (data) {
          //log and send Location data
          defaultLogger.info('sendFile() successful');
          moduleLogger.info('Image successfully uploaded');
          return resolve(data); //potentially return resolve(data) if you need the data
        }
      });
    });
  },
  getFile: (key) => {
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
    };
    //wrap in promise
    return new Promise((resolve, reject) => {
      s3.getObject(params, function (err, data) {
        if (err) {
          moduleLogger.error(`Error cannot fetch file. ERROR: ${err}`);
          return reject('File Fetch Failed');
        }
        //log and send Location data
        defaultLogger.info('getFile() successful');
        moduleLogger.info('Image successfully fetched');
        return resolve(data); //potentially return resolve(data) if you need the data
      });
    });
  },
};

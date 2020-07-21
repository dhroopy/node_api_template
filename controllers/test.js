//require s3 to upload images
const { sendFile, getFile } = require('../helper/aws');

//require winston
const winston = require('winston');
// Get logger from external configuration source
const winstonConfig = require('../config/winston-config');

let defaultLogger = winstonConfig.defaultLogger;

const MODULE = 'test-controller';
// Add another logger with the category specific to this module
winston.loggers.add(MODULE, winstonConfig.createLoggerConfig(MODULE));
// Module-specific logger
const moduleLogger = winston.loggers.get(MODULE);
const Test = require('../models/test');

/**
 *Test Controller
 */
//creating token

const JWT = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/index');
const signToken = (newUser) => {
  return JWT.sign(
    {
      user_id: newUser.user_id,
      role_id: newUser.role_id,
      token: newUser.token,
      sub: newUser.username, //should use id but using username to test in development
      iat: new Date().getTime(),
    },
    JWT_SECRET,
    { expiresIn: '1h' },
  );
};
module.exports = {
  testController: async (req, res) => {
    defaultLogger.info('In controller/test');
    moduleLogger.info(
      `testController method called with @params: ${JSON.stringify(
        req.body,
      )}, @url: ${req.originalUrl}`,
    );
    /**
     * @author @sahilq
     */
    try {
      const results = await Test.testModel(req.body);
      results.length === 0
        ? res.status(404).send('Not Found')
        : res.status(200).json(results);
    } catch (e) {
      res.status(500).json(e);
    }
  },
  signIn: async (req, res) => {
    const token = await signToken(req.user);
    const response = { user: req.user, token };
    res.status(200).json(response);
  },
  fetchCompanyById: async (req, res) => {
    try {
      const results = await Test.fetchCompany(req.body);
      results.length === 0
        ? res.status(404).send('Not Found')
        : res.status(200).json(results);
    } catch (e) {
      res.status(500).json(e);
    }
  },
  //testing image upload to aws s3
  imageUploadTest: async (req, res) => {
    try {
      //making sure the file exits
      if (!req.file || !req.file.buffer) {
        //if file doesn't exist handle its
        const error = new Error();
        error.status = 400;
        error.message = 'No file selected or Invalid image name/key';
        moduleLogger.error('No file selected or Invalid image name/key.');
        throw error;
      }
      // send file to s3 bucket and save response location of uploaded file will be in s3Response.Location
      const s3Response = await sendFile(
        'ct_api_node_testing_image_upload',
        req.file.buffer,
      );
      // eslint-disable-next-line no-console
      console.log('s3Response :>> ', s3Response);
      //TODO:
      //add image Location to database
      const results = Test.imageUploadTest('some data from req');
      results.length === 0
        ? res.status(404).send('Not Found')
        : res.status(200).json(results);
    } catch (e) {
      //handle if any errors
      res.status(500).json(e);
    }
  },
  imageGetTest: async (req, res) => {
    const s3response = await getFile('ct_api_node_testing_image_upload');
    console.log('s3response :>> ', s3response);
  },
};

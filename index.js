const express = require('express');
const app = express();
const bodyParser = require('body-parser');
require('dotenv').config();
const terminate = require('./terminate');

// Get logger from external configuration source
const winstonConfig = require('./config/winston-config');

let defaultLogger = winstonConfig.defaultLogger;

//**database connection */
require('./loaders/database/connection');
const PORT = process.env.PORT;

//Middleware
//BodyParser
// for parsing application/json
app.use(bodyParser.json());

// for parsing application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
//form-urlencoded

if (app.get('env') === 'development') {
  console.log('Development Mode Detected');

  //Enabling CORS
  const cors = require('cors');
  app.use(cors());
  console.log(`CORS enabled`);

  //Enabling Morgan for dev
  require('./loaders/morgan')(app);
  console.log('Morgan enabled');
}

//Swagger
require('./loaders/swagger')(app, PORT);
/////////

////handling routes
/**
 * @swagger
 * /_health:
 *  get:
 *    summary: Use to check if server is running properly
 *    tags:
 *      - Tests
 *    responses:
 *      '200':
 *        description: OK
 *      '500':
 *        description: Server is Down
 */
app.get('/_health', (req, res) => {
  res.status(200).send('HEALTHY');
});
require('./loaders/routes')(app);

const server = app.listen(PORT, () =>
  defaultLogger.info(`Listening on PORT ${PORT}...`),
);
////coreDump = Operating System's Core Dump -> has to be manually set acc to OS
const extHandler = terminate(server, { coreDump: false, timeout: 1000 });
//Logging for process exits
process.on('SIGINT', extHandler(0, 'SIGINT'));
process.on('SIGTERM', extHandler(0, 'SIGTERM'));
process.on('uncaughtException', extHandler(1, 'Unhandled Error'));
process.on('unhandledRejection', extHandler(1, 'Unhandled Promise Reject'));

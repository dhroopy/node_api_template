const morgan = require('morgan');

module.exports = function (app) {
  //Middleware -> morgan
  app.use(morgan('dev')); //logger
};

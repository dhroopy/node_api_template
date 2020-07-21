module.exports = function (app) {
  //Handling Routes
  app.use('/test', require('../routes/test')); //example
  app.use('/farm', require('../routes/farm')); //for farm controller

  //Some error
  app.use((req, res, next) => {
    const error = new Error('404 NOT FOUND');
    error.status = 404;
    next(error);
  });
};

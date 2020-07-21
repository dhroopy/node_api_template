const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

module.exports = (app, PORT) => {
  const swaggerOptions = require('../../config/swagger-config').createSwaggerOptions(
    PORT,
  );
  const swaggerDocs = swaggerJsDoc(swaggerOptions);
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
};

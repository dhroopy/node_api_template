function createSwaggerOptions(PORT) {
  // Extended: https://swagger.io/specification/#infoObject
  const swaggerOptions = {
    swaggerDefinition: {
      info: {
        version: '1.0.0',
        title: 'ct_api_node',
        description: 'CropTrails 3.0 Node',
        contact: {
          name: 'SSS',
        },
        basePath: '/',
        servers: [
          {
            url: `http://localhost:${PORT}`,
          },
        ],
      },
    },
    apis: ['index.js', './routes/*.js', './loaders/routes.js'],
  };
  return swaggerOptions;
}

module.exports.createSwaggerOptions = createSwaggerOptions;

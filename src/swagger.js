const swaggerUi = require('swagger-ui-express'),
swaggerDocument = require('../swagger.json')


function swaggerDocs(app, port) {
  // Swagger Page
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

}

module.exports = swaggerDocs
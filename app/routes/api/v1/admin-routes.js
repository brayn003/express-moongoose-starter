const { declareApiRoutes } = require('~helpers/route-service');

const routes = [
  // admins
  'get    /get-admins       admin/find',

  // users
  'get    /users            user/find',
];

module.exports = declareApiRoutes(routes);

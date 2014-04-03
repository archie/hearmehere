// include and run the express app locally (only for development purposes)

process.env.NODE_ENV = 'local';
var development = require('./cloud/app');
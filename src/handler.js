const serverless = require('serverless-http');
const { createApplication } = require('./bootstrap');

module.exports.handler = serverless(createApplication());

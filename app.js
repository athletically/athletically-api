const envConf = require('dotenv').config({ debug: process.env.DEBUG });

if (envConf.error) {
  throw envConf.error
} 

const express = require('express');
const database = require('./www/db/db');
const appConfig = require('./config/appConfig');
const routeLoggerMiddleware = require('./app/middlewares/routeLogger');
const globalErrorMiddleware = require('./app/middlewares/appErrorHandler');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const schemaPath = './app/models';
//Bootstrap models
fs.readdirSync(schemaPath).forEach(function (file) {
  if (~file.indexOf('.js')) require(schemaPath + '/' + file)
});
// end Bootstrap models
// app.set('views','views');
// app.set('view engine','ejs');
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(bodyParser.urlencoded({ extended : true }));
// app.use(express.bodyParser());
app.use(routeLoggerMiddleware.logIp);
app.use(globalErrorMiddleware.globalErrorHandler);

app.all(appConfig.allowedCorsOrigin, function(req, res, next) {
  res.header("Access-Control-Allow-Origin", appConfig.allowedCorsOrigin);
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept,token,key");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
  next();
});
process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
  // application specific logging, throwing an error, or other logic here
});

// app.use(express.static(path.join(__dirname, 'views')));

// Bootstrap route
const routesPath = './app/routes';
fs.readdirSync(routesPath).forEach(function (file) {
  if (~file.indexOf('.js')) {
    let route = require(routesPath + '/' + file);
    route.setRouter(app);
  }
});
// end bootstrap route

/* Start Database*/

database.startDB(app,process.env.DATABASE_TYPE);

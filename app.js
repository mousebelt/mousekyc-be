// Setup basic express server
const fs = require('fs');
const join = require('path').join;
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const nocache = require('nocache');
const http = require('http');
const config = require('./config');
// config
const app = express();
app.set('config', config);

const port = process.env.PORT || config.port;

// server
var server;
server = require('http').createServer(app);

// io server
const io = require('socket.io')(server);

// connect mongodb
connect();

// models
const models = join(__dirname, './models');
// Bootstrap models
fs.readdirSync(models)
  .filter(file => ~file.search(/^[^\.].*\.js$/))
  .forEach(file => require(join(models, file)));

// Routing
app.use(require('cors')());
app.use(cookieParser());
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));
app.use(nocache());

// routing
const Router = require('./routes/app');
app.use('/', Router)

// socket server module import
require('./socketservice/socket-server')(io);

//cron for updating db
require('./cronservice/cron').start();

function connect() {
  var options = { server: { socketOptions: { keepAlive: 1 } } };
  return mongoose.connect(config.db).connection;
}

server.listen(port, function () {
  console.log('Server listening at port %d', port);
});

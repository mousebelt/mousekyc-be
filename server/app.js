const fs = require("fs");
const join = require('path').join;
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const nocache = require("nocache");
const http = require("http");
var Grid = require("gridfs-stream");
Grid.mongo = mongoose.mongo;

const config = require("./config");
// config
app.set("config", config);
const port = process.env.PORT || config.port;

// server
var server = require("http").createServer(app);

// connect mongodb
connect();
mongoose
  .connect(config.db /* { server: { socketOptions: { keepAlive: 1 } } } */)
  .then(conn => {
    // GridFS setting
    var gfs = Grid(conn.connection.db);
    app.set("gfs", gfs);
  })
  .catch(err => {
    console.log("DB error occured !", err);
  });

// models
const models = join(__dirname, "./models");
// Bootstrap models
fs
  .readdirSync(models)
  .filter(file => ~file.search(/^[^\.].*\.js$/))
  .forEach(file => require(join(models, file)));

// Routing
app.use(require("cors")());
app.use(cookieParser());
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(
  bodyParser.urlencoded({
    // to support URL-encoded bodies
    extended: true
  })
);
app.use(fileUpload());
app.use(nocache());

// routing
const Router = require("./routes/app");
app.use("/", Router);

// io server
const io = require("socket.io")(server);
require("./socketservice/socket-server")(io);
//cron for updating db
require("./cronservice/cron").start();

// initialize image folder for uploading
(function() {
  try {
    fs.mkdirSync("./uploads/");
    console.log("Created folder, /uploads");
  } catch (err) {
    if (err.code !== "EEXIST") throw err;
  }
})();
function connect() {
  var options = { server: { socketOptions: { keepAlive: 1 } } };
  return mongoose.connect(config.db).connection;
}

server.listen(port, function() {
  console.log("Server listening at port %d", port);
});

module.exports = server
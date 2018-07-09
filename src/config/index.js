const  _ = require("lodash");
const defaults = require("./default.js");
const config = require("./" + (process.env.NODE_ENV || "production") + ".js");

module.exports = _.merge({}, defaults, config);

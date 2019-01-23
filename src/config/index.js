const _ = require('lodash');
const defaults = require('./default.js');
const config = require('./' + (process.env.NODE_ENV || 'development') + '.js'); // eslint-disable-line

module.exports = _.merge({}, defaults, config);

const _ = require('lodash');
const defaults = require('./default.js');
console.log('=====================dddd===============', process.env.NODE_ENV);
const config = require('./' + (process.env.NODE_ENV || 'production') + '.js'); // eslint-disable-line

module.exports = _.merge({}, defaults, config);

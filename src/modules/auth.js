const jwt = require('jsonwebtoken');
// const config = require('../config');
const AdminModel = require('../models/admin');
const UserModel = require('../models/user');

/**
 * Make authorization token
 * @param {userInfo} payload
 * @param {tokenOption} options
 */
exports.makeLoginToken = (payload, options) => (jwt.sign({ _id: payload }, 'secret', options));

exports.makeUserLoginToken = (payload, options) => (jwt.sign({ _id: payload, type: 'user' }, 'secret', options));

exports.makeAdminLoginToken = (payload, options) => (jwt.sign({ _id: payload, type: 'admin' }, 'secret', options));

exports.getAdminFromToken = async (tokenRaw) => {
  try {
    if(String(tokenRaw) === '') throw new Error('empty token !');
    const decoded = (jwt.verify(String(tokenRaw), 'secret'));
    const { _id } = JSON.parse(JSON.stringify(decoded));
    const admin = await AdminModel.findById(_id);
    return admin;
  } catch(e) {
    return undefined;
  }
};

exports.getUserFromToken = async (tokenRaw) => {
  try {
    if(String(tokenRaw) === '') throw new Error('empty token !');
    const decoded = (jwt.verify(String(tokenRaw), 'secret'));
    const { _id } = JSON.parse(JSON.stringify(decoded));
    const user = await UserModel.findById(_id);
    return user;
  } catch(e) {
    return undefined;
  }
};

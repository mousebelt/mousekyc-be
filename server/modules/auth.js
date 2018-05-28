const jwt = require('jsonwebtoken')
const config = require('../config');
const AdminModel = require('../models/admin');

/**
 * Make authorization token
 * @param {userInfo} payload 
 * @param {tokenOption} options 
 */
exports.makeLoginToken = (payload, options) => {
    return jwt.sign({ _id: payload }, 'secret', options)
}

/**
 * Get loggedUserInfo
 * @param {request} req 
 */
exports.getLoggedInAdmin = async (req) => {
    const tokenRaw = req.headers['authorization']
    return await getAdminFromToken(tokenRaw)
}

exports.getAdminFromToken = async (tokenRaw) => {
    try {
        if (String(tokenRaw) == '') throw 'empty token !'
        var decoded = (jwt.verify(String(tokenRaw), 'secret'))
        var { _id } = JSON.parse(JSON.stringify(decoded))
        var admin = await AdminModel.findById(_id)
        return admin
    } catch (e) {
        return undefined
    }
}

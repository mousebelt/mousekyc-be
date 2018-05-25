const jwt = require('jsonwebtoken')
const config = require('../config');
const User = require('../models/admin');

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
exports.getLoggedInUser = async (req) => {
    const tokenRaw = req.headers['authorization']
    return await getUserFromToken(tokenRaw)
}

exports.getUserFromToken = async (tokenRaw) => {
    try {
        if (!tokenRaw || tokenRaw == '') throw 'empty token !'
        var decoded = (jwt.verify(String(tokenRaw), 'secret'))
        var { _id } = JSON.parse(JSON.stringify(decoded))
        var user = await User.findById(_id)
        return user
    } catch (e) {
        return undefined
    }
}

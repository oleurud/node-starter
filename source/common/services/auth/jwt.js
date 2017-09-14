'use strict'

const jwt = require('jsonwebtoken')
const moment = require('moment')
const debug = require('debug')('app:jwt')
const parameters = requireRoot('../parameters');
const exception = requireRoot('common/services/customExceptions')
const TYPE = 'JWT '

module.exports = {
    generateAccessToken: (user, device) => {
        return TYPE + jwt.sign(
            {
                _id: user._id,
                username: user.username,
                role: user.role,
                device: device,
                random: Math.floor(Math.random() * 1000000)
            },
            parameters.secret,
            {
                expiresIn: 24*60*60
            }
        );
    },

    async verify(token, device) {
        if(!token || token.indexOf(TYPE) !== 0) {
            throw new exception.ValidationPublicKeyFailed()
        }

        try {
            return jwt.verify(token.substring(TYPE.length), parameters.secret)
        } catch (err) {
            if(err.name === 'TokenExpiredError') {
                throw new exception.ValidationTokenExpired()
            }
            
            throw new exception.ValidationPublicKeyFailed()
        }
    }
}

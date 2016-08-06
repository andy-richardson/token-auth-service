const Promise = require('bluebird');
const jwt = Promise.promisifyAll(require('jsonwebtoken'), {suffix: 'Prom'});
const config = require('../private/config');

/* VERIFY AND DECRYPT TOKEN */
module.exports.decrypt = function(token){
    return new Promise(function(fulfill, reject){
        return jwt.verifyProm(token, config.jwt.secret)
        .then(function(data){
            return fulfill(data);
        })
        .catch(function(err){
            return reject(err);
        })
    })
}

/* CREATE NEW TOKEN */
module.exports.create = function(data){
    return new Promise(function(fulfill, reject){
        const token = jwt.sign(data,
            config.jwt.secret
        );

        return fulfill({
            token: token
        });
    });
}

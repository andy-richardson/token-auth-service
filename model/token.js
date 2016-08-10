const Prom = require('bluebird');
const jwt = Prom.promisifyAll(require('jsonwebtoken'), {suffix: 'Prom'});
const config = require('../private/config');

/* VERIFY AND DECRYPT TOKEN */
module.exports.decrypt = function(token){
    return jwt.verifyProm(token, config.jwt.secret);
};

/* CREATE NEW TOKEN */
module.exports.create = function(data){
    return jwt.signProm(data, config.jwt.secret, null);
};

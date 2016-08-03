const Promise = require('bluebird');
const crypto = require('crypto');
const jwt = Promise.promisifyAll(require('jsonwebtoken'), {suffix: 'Prom'});
const config = require('../private/config');

/* VERIFY TOKEN STATE */
module.exports.verify = function(req, res, next){
    const accessToken = (req.headers.accesstoken != undefined) ? req.headers.accesstoken : req.body.token;

    return jwt.verifyProm(accessToken, config.jwt.secret)
    .then(function(data){
        req.decoded = data;
        return next();
    })
    .catch(function(err){
        res.status(403);
        return res.json(err);
    });
};

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

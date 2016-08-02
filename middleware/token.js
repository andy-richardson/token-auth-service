const Promise = require('bluebird');
const crypto = require('crypto');
const jwt = Promise.promisifyAll(require('jsonwebtoken'), {suffix: 'Prom'});
const config = require('../private/config');

/* VERIFY TOKEN STATE */
const verify = function(req, res, next){
    const accessToken = (req.headers.accesstoken != undefined) ? req.headers.accesstoken : req.cookies.accessToken;

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
const create = function(data){
    return new Promise(function(fulfill, reject){
        data.tokenId = crypto.randomBytes(12).toString('hex');
        const token = jwt.sign(data,
            config.jwt.secret,
            {
                expiresIn: '7 days'
            }
        );

        return fulfill({
            token: token,
            node: {
                tokenId: data.tokenId,
                expiry: null
            }

        });
    });
}

module.exports = {
    verify: verify,
    create: create
}

const express = require('express');
const router = express.Router();

const jwt = require('jsonwebtoken');
const config = require('../private/config');
const Token = require('../middleware/token');

const Promise =require('bluebird');
const AuthUserModel = Promise.promisifyAll(require('../model/authUser').model(), {suffix: 'Prom'});

/* REQUEST JWT */
router.post('/', function(req, res, next){
    const credentials = {
        username: req.body.username,
        password: req.body.password
    };

    // Cross-promise variables
    var user;
    var token;

    // Check credentials
    return AuthUserModel.whereProm(credentials, {limit: 1})
    .then(function(node){
        console.log(node);
        if(!node.length){
            throw {
                status: 403,
                message: 'Username and password do not match'
            };
        }

        // For future use
        userid = node[0].id;

        // Create token
        const data = { username: credentials.username };
        return Token.create(data);
    })
    .then(function(data){
        token = data.token;
        // Append new token to user 'has_token' relationship
        return AuthUserModel.pushProm(userid, 'tokens', data.node)
    })
    .then(function(data){
        res.status(200);
        res.json({token: token});
    })
    .catch(function(err){
        next(err);
    });
});

/* TODO GET NEW JWT */
router.patch('/', Token.verify, function(req, res, next){
    const data = req.decoded;
    data.tokenId = data.iat = data.exp = undefined;

    const token = Token.create(data);

    res.cookie('accessToken', token);
    res.json({accessToken: token});
})

/* CREATE NEW AUTH USER */
router.post('/user', function(req, res, next){
    const credentials = { username: req.body.username };

    // Check if user already exists
    AuthUserModel.whereProm(credentials)
    .then(function(nodes){
        if(nodes.length > 0){
            throw {
                status: 422,
                message: 'User already exists'
            };
        }

        // TODO validate password
        credentials.password = req.body.password;
        return AuthUserModel.saveProm(credentials)
    })
    .then(function(){
        res.status(201);
        res.json({status: 'success'});
    })
    .catch(function(err){
        next(err);
    });
})

module.exports = router;

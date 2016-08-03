const express = require('express');
const Promise =require('bluebird');
const router = express.Router();

// Model interfaces
const User = require('../model/user');
const Token = require('../model/token');

/* REQUEST JWT */
router.post('/', function(req, res, next){
    return User.createSession(req.body.username, req.body.password)
    .then(function(data){
        res.status(200);
        res.json(data);
    })
    .catch(function(err){
        next(err);
    })
})

/* TODO GET NEW JWT */
router.patch('/', Token.verify, function(req, res, next){
    const data = req.decoded;
    // data.tokenId = data.iat = data.exp = undefined;
    //
    // const token = Token.create(data);
    //
    // res.json({token: token});
})

/* CREATE NEW AUTH USER */
router.post('/user', function(req, res, next){
    return User.create(req.body.username, req.body.password)
    .then(function(data){
        res.status(201);
        return res.json({status: 'success'});
    })
    .catch(function(err){
        next(err);
    })
})

module.exports = router;

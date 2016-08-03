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

});

/* CHECK TOKEN IS VALID */
router.get('/', function(req, res, next){
    return Token.decrypt(req.query.token)
    .then(function(data){
        return User.validateSession(data.username, data.sessionId);
    })
    .then(function(valid){
        res.status(200);

        if(valid){
            return res.json({status: 1});
        }
        return res.json({status: 0});
    })
    .catch(function(err){
        res.status(500);
        res.json(err);
    })
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

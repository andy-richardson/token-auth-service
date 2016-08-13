const express = require('express');
const router = require('express-promise-router')();

// Model interfaces
const User = require('../model/user');
const Token = require('../model/token');

/* REQUEST JWT */
router.post('/', function(req, res, next){
    return User.createSession(req.body.username, req.body.password)
    .then(function(token){
        res.status(200);
        res.json({token: token});
    });
});

/* REQUEST NEW JWT */
router.patch('/', function(req, res, next){
    return User.patchSession(req.body.token)
    .then(function(token){
        res.status(200);
        res.json({token: token});
    });
});

/* CHECK TOKEN IS VALID */
router.get('/', function(req, res, next){
    return User.validateSession(req.query.token)
    .then(function(username){
        res.status(200);
        res.json({username: username});
    });
});

/* DELETE USER SESSION */
router.delete('/', function(req, res, next){
    return User.deleteSession(req.body.token)
    .then(function(data){
        res.status(200);
        res.json({status: 'success'});
    });
});

/* CREATE NEW AUTH USER */
router.post('/user', function(req, res, next){
    return User.create(req.body.username, req.body.password)
    .then(function(data){
        res.status(201);
        res.json({message: 'success'});
    });
});

module.exports = router;

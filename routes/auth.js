const express = require('express');
const Promise =require('bluebird');
const router = express.Router();

// Model interfaces
const User = require('../model/user');
const Token = require('../model/token');

/* CHECK TOKEN IS VALID -- MIDDLEWARE */
const validateToken = function(req, res, next){
    return Token.decrypt(req.body.token)
    .then(function(token){
        req.token = token;
        return User.validateSession(token.username, token.sessionId);
    })
    .then(function(valid){
        if(!valid){
                throw {
                    message: "Token is blacklisted"
            }
        }

        return next();
    })
    .catch(function(err){
        next(err);
    })
}

/* REQUEST JWT */
router.post('/', function(req, res, next){
    return User.createSession(req.body.username, req.body.password)
    .then(function(data){
        res.status(200);
        res.json(data);
    })
    .catch(function(err){
        next(err);
    });
});

/* REQUEST NEW JWT */
router.patch('/', validateToken, function(req, res, next){
    return User.createSession(req.token.username)
    .then(function(token){
        res.status(200);
        res.json(token);
    })
    .catch(function(err){
        next(err);
    });
});

/* CHECK TOKEN IS VALID */
router.get('/', function(req, res, next){
    return Token.decrypt(req.query.token)
    .then(function(token){
        return User.validateSession(token.username, token.sessionId);
    })
    .then(function(valid){
        res.status(200);

        if(valid){
            return res.json({valid: 1});
        }

        res.json({valid: 0});
    })
    .catch(function(err){
        next(err);
    });
});

/* DELETE USER SESSION */
router.delete('/', validateToken, function(req, res, next){
    return User.deleteSession(req.token.sessionId)
    .then(function(data){
        res.status(200);
        res.json({status: 'success'});
    })
    .catch(function(err){
        next(err);
    });
});

/* CREATE NEW AUTH USER */
router.post('/user', function(req, res, next){
    return User.create(req.body.username, req.body.password)
    .then(function(data){
        res.status(201);
        res.json({message: 'success'});
    })
    .catch(function(err){
        next(err);
    });
});

module.exports = router;

'use strict';
const Prom = require('bluebird');
const bcrypt = Prom.promisifyAll(require('bcrypt'), {suffix: 'Prom'});
const config = require('../private/config');
const ModelHandler = require('./ModelHandler');
const Session = require('./session');
const Token = require('./token');

/* PASSWORD ENCRYPTION */
const hasher = {
    encrypt: function(password){
        return bcrypt.hashProm(password, config.encryption.saltRounds);
    },
    compare: function(password, hash){
        return bcrypt.compareProm(password, hash);
    }
};

/* SCHEMA */
const schema = {
    username: {
        type: String,
        lowercase: true,
        required: true
    },
    password: {
        type: String,
        required: true
    }
};

/* RELATIONSHIPS */
const relationships = [
    {
        model: Session.model,
        objLabel: 'sessions',
        relName: 'has_session',
        opts: {many: true}
    }
];

/* COMPOSE RELATIONSHIPS */
const compose = function(){
    relationships.forEach(function(rel){
        model.compose(
            rel.model(),
            rel.objLabel,
            rel.relName,
            rel.opts
        );
    });
};

/* CREATE INSTANCE OF MODEL */
const AuthUserHandler = new ModelHandler('AuthUser', schema);
let database, model;

/* INITIALIZE */
module.exports.init = function(db){
    AuthUserHandler.init(db);
    model = Prom.promisifyAll(AuthUserHandler.getModel(), {suffix: 'Prom'});

    Session.init(db, model);
    compose();
    database = db;
    database.rel.delete = Prom.promisify(database.rel.delete);
};

/* CREATE NEW AUTH USER */
module.exports.create = function(username, password){
    return new Prom(function(resolve, reject){
        // Ensure username provided
        if(username === undefined){
            return reject(new Error('Username validation failed'));
        }

        model.whereProm({
            username: username
        })
        .then(function(nodes){
            if(nodes.length > 0){
                return reject(new Error('User already exists'));
            }

            return hasher.encrypt(password);
        })
        .then(function(hash){
            // Add credentials to database
            return model.saveProm({
                username: username,
                password: hash
            });
        })
        .then(function(data){
            return resolve(data.id);
        })
        .catch(function(err){
            // Cleaner validation errors
            const message = err.message;
            if(message.includes('validation failed when parsing `username`')){
                return reject(new Error('Username validation failed'));
            }


            if(message.includes('validation failed when parsing `password`')){
                return reject(new Error('Password validation failed'));
            }

            // Unknown validation error - safety
            reject(err);
        });
    });
};

/* CREATE NEW SESSION */
module.exports.createSession = function(username, password){
    return model.whereProm({username: username}, {limit:1})
    .then(function(node){
        if(!node.length){
            throw new Error('User does not exist');
        }

        const user = node[0];

        // Password checking
        if(password !== undefined){
            return hasher.compare(password, user.password)
            .then(function(valid){
                if(!valid){
                    throw new Error('Bad credentials');
                }

                return Session.create(user.id);
            });
        }

        // Create new session
        return Session.create(user.id);
    })
    .then(function(session){
        const seshData = {
            username: username,
            sessionId: session.id,
            exp: session.expiry
        };

        return Token.create(seshData);
    });
};

/* PATCH SESSION */
module.exports.patchSession = function(token){
    return Session.validate(token)
    .then(function(data){
        return module.exports.createSession(data.username);
    });
};

/* VALIDATE SESSION */
module.exports.validateSession = function(token){
    return Session.validate(token)
    .then(function(data){
        return data.username;
    });
};

/* DELETE SESSION */
module.exports.deleteSession = function(token){
    return Session.validate(token)
    .then(function(data){
        return Session.delete(data.sessionId);
    });
};

/* DELETE ALL SESSIONS */
module.exports.deleteAllSessions = function(username){
    return model.whereProm({username: username}, {limit:1})
    .then(function(node){
        const user = node[0];

        if(user.sessions !== undefined){
            let proms = [];

            user.sessions.forEach(function(obj){
                proms.push(Session.delete(obj.id));
            });

            return Prom.all(proms);
        }
    });
};

/* SET PASSWORD */
module.exports.setPassword = function(username, password){
    let user;

    return model.whereProm({username: username}, {limit: 1})
    .then(function(node){
        user = node[0];
        if(user === undefined){
            throw new Error('Username validation failed');
        }

        const async = [
            hasher.encrypt(password),
            module.exports.deleteAllSessions(username)
        ];

        return Prom.all(async);
    })
    .then(function(data){
        user.password = data[0];
        return model.update(user);
    });
};

/* RETURN MODEL */
module.exports.model = function(){
    return model;
};

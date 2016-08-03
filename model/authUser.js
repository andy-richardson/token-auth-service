'use strict'
const Promise = require('bluebird');
const ModelHandler = require('./ModelHandler');
const userSession = require('./userSession');

/* SCHEMA */
const schema = {
    username: {
        type: String,
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
        model: userSession.model,
        objLabel: 'sessions',
        relName: 'has_session'
    }
]

/* COMPOSE RELATIONSHOPS */
const compose = function(){
    relationships.forEach(function(rel){
        authUserModel.compose(
            rel.model(),
            rel.objLabel,
            rel.relName
        )
    })
}

/* CREATE INSTANCE OF MODEL */
const AuthUserHandler = new ModelHandler('AuthUser', schema);
var model;

/* MODEL FUNCTIONS */
const functions = {
    init: function(db){
        AuthUserHandler.init(db);
        userSession.init(db);

        model = AuthUserHandler.getModel();
        compose();
    },

    create: function(username, password){
        return new Promise(function(resolve, reject){
            // Check if user already exists
            model.whereProm({
                username: username
            })
            .then(function(nodes){
                if(nodes.length > 0){
                    return reject({
                        status: 422,
                        message: 'User already exists'
                    });
                }

                // Add credentials to database
                return model.saveProm({
                    username: username,
                    password: password
                });
            })
            .then(function(data){
                return resolve(data.id);
            })
        });
    },

    model: function(){
        return model;
    }
}

module.exports = functions;

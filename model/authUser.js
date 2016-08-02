'use strict'
const Model = require('./model');
const userToken = require('./userToken');

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
        model: userToken.model,
        objLabel: 'tokens',
        relName: 'has_token'
    }
]

/* COMPOSE RELATIONSHOPS */
const compose = function(){
    relationships.forEach(function(rel){
        AuthUserModel.getModel().compose(
            rel.model(),
            rel.objLabel,
            rel.relName
        )
    })
}

const AuthUserModel = new Model('AuthUser', schema);

module.exports = {
    init: function(db){
        AuthUserModel.init(db);
        userToken.init(db);
        compose();
    },
    model: function(){
        return AuthUserModel.getModel();
    }
}

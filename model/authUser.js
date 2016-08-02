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

const AuthUserModel = new Model('AuthUser', schema);

module.exports = {
    init: function(db){
        AuthUserModel.init(db);
        userToken.init(db);
        AuthUserModel.getModel().compose(userToken.model(), 'tokens', 'has_token');
    },
    model: function(){
        return AuthUserModel.getModel();
    }
}

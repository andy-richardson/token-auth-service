'use strict'
const ModelHandler = require('./ModelHandler');
const moment = require('moment');

/* SCHEMA */
const schema = {
    expiry: {
        type: Date,
        required: true
    }
};

const UserSessionHandler = new ModelHandler('UserSession', schema);
var model, userModel;

/* INITIALIZE */
module.exports.init = function(db, uModel){
    UserSessionHandler.init(db);
    model = UserSessionHandler.getModel();
    userModel = uModel;
};

/* CREATE NEW USER SESSION */
module.exports.create = function(userId){
    const expiry = moment().add(6, 'days').unix();
    return userModel.pushProm(userId, 'sessions', {expiry: expiry})
};

/* RETURN MODEL */
module.exports.model = function(){
    return model;
}

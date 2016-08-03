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

/* VALIDATE USER SESSION */
module.exports.validate = function(username, sessionId){
    return new Promise(function(fulfill, reject){
        userModel.whereProm({username: username}, {limit: 1})
        .then(function(data){
            const sessions = data[0].sessions;

            // No sessions found
            if(sessions == undefined){
                return fulfill(false);
            }

            // One session found
            else if(!Array.isArray(sessions)){
                return fulfill(sessions.id == sessionId);
            }

            // Many sessions found
            else{
                sessions.forEach(function(session){
                    if(session.id == sessionId){
                        return fulfill(true);
                    }
                    return fulfill(false);
                })
            }
        })
        .catch(function(err){
            reject(err);
        })
    })
};

/* RETURN MODEL */
module.exports.model = function(){
    return model;
}

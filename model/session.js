'use strict'
const Promise = require('bluebird');
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
var database, model, userModel;

/* INITIALIZE */
module.exports.init = function(db, uModel){
    UserSessionHandler.init(db);
    model = Promise.promisifyAll(UserSessionHandler.getModel(), {suffix: 'Prom'});
    userModel = uModel;
    database = Promise.promisifyAll(db, {suffix: 'Prom'});
};

/* CREATE NEW USER SESSION */
module.exports.create = function(userId){
    const expiry = moment().add(6, 'days').unix();
    return userModel.pushProm(userId, 'sessions', {expiry: expiry})
};

/* VALIDATE USER SESSION */
module.exports.validate = function(username, sessionId){
    return new Promise(function(fulfill, reject){
        return userModel.whereProm({username: username}, {limit: 1})
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
                var found = false;
                for(var x in sessions){
                    if(sessions[x].id == sessionId){
                        found = true;
                        break;
                    }
                }

                return fulfill(found);
            }
        })
        .catch(function(err){
            reject(err);
        });
    })
};

/* DELETE USER SESSION */
module.exports.delete = function(sessionId){
    return database.deleteProm({id: sessionId}, true)
}

/* RETURN MODEL */
module.exports.model = function(){
    return model;
}

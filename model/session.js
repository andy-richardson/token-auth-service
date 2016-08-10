const Promise = require('bluebird');
const moment = require('moment');
const config = require('../private/config');
const Token = require('./token');
const ModelHandler = require('./ModelHandler');

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
    const exp = config.jwt.expiry;
    const expiry = moment().add(exp.num, exp.unit).unix();
    return userModel.pushProm(userId, 'sessions', {expiry: expiry});
};

/* VALIDATE USER SESSION */
module.exports.validate = function(token){
    // Returns error or decrypted token
    var tokenData;

    return Token.decrypt(token)
    .then(function(data){
        tokenData = data;
        return userModel.whereProm({username: data.username}, {limit: 1});
    })
    .then(function(node){
        // Check token for blacklist
        const sessions = node[0].sessions;
        var valid = false;

        for(var pos in sessions){
            if(sessions[pos].id == tokenData.sessionId){
                valid = true;
                break;
            }
        }

        if(sessions === undefined || !valid){
            throw new Error('Token is blacklisted');
        }

        return tokenData;
    });
};

/* DELETE USER SESSION */
module.exports.delete = function(sessionId){
    return database.deleteProm({id: sessionId}, true);
};

/* RETURN MODEL */
module.exports.model = function(){
    return model;
};

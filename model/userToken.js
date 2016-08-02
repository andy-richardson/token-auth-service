'use strict'
const Model = require('./model');

/* SCHEMA */
const schema = {
    tokenId: {
        type: String,
        required: true
    }
};

const UserTokenModel = new Model('UserToken', schema);

module.exports = {
    init: function(db){
        return UserTokenModel.init(db);
    },
    model: function(){
        return UserTokenModel.getModel();
    }
}

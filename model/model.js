// WARNING: Currently has redundancy -> copy also on rendo-api

'use strict';
const model = require('seraph-model');

class Model{
    constructor(name, schema){
        this.name = name;
        this.schema = schema;
    }

    init(db){
        this.model = model(db, this.name);
        this.model.schema = this.schema;
    }

    getModel(){
        return this.model;
    }

    setSchema(object){
        this.model.schema = object;
    }
}

module.exports = Model;

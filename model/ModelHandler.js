'use strict';
const model = require('seraph-model');

class ModelHandler{
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

module.exports = ModelHandler;

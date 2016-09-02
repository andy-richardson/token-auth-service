'use strict';
const model = require('seraph-model');

class ModelHandler{
    constructor(name, schema, relations){
        this.name = name;
        this.schema = schema;
        this.relationships = relations;
    }

    init(db){
        this.model = model(db, this.name);
    }

    compose(){
        if(this.relationships !== undefined){
            this.relationships.forEach((rel)=>{
                this.model.compose(
                    rel.model(),
                    rel.objLabel,
                    rel.relName,
                    rel.opts
                );
            });
        }
    }

    getModel(){
        return this.model;
    }

    setSchema(object){
        this.model.schema = object;
    }
}

module.exports = ModelHandler;

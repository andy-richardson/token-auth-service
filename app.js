const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const seraph = require('seraph');

// Routes
const authRouter = require('./routes/auth');
const errorRouter = require('./routes/error');

const app = express();
const config = require('./private/config');

const database = seraph(config.database);

// Create Models
const User = require('./model/user');
User.init(database);

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.use('/auth', authRouter);

// 404 Not found
app.use(function(req, res, next) {
    next({
        message: "Not found"
    });
});

app.use(errorRouter);

module.exports = app;

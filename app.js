const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const seraph = require('seraph');

const app = express();
const config = require('./private/config');

const database = seraph(config.database);

// Create Models
const User = require('./model/user');
User.init(database);

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const authRouter = require('./routes/auth');
app.use('/auth', authRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// development error handler
// will print stacktrace
// if (app.get('env') === 'development') {
//   app.use(function(err, req, res, next) {
//     res.status(err.status || 500);
//     res.json({
//       message: err.message,
//       error: err
//     });
//   });
// }

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    console.log(err);
    res.status(err.status || 500);
    res.json({
        err
    });
});


module.exports = app;

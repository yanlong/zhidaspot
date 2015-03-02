var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'DXPhE3la4XEG6KV1QaO3wiM',
  resave: false,
  saveUninitialized: true
}))

// Mount plugins
// User
app.use('/', require('./plugins/user.js'));
// Token
app.use('/', require('./plugins/token.js'));
// Auth
app.use('/', require('./plugins/auth.js'));
// Get app data.
app.use('/', require('./plugins/data.js'));

// Mount routes
app.use('/', routes);
app.use('/', require('./routes/app.js'));
app.use('/api', require('./routes/api.js'));
app.use('/users', users);
app.use('/:page/:pageId?', function (req, res, next) {
    // res.send(req.params)
    var page = req.params.page;
    var pageRoot = 'pages/';

    req.params.tplData = {
        pageRoot: pageRoot,
        page: page,
        pageId: req.params.pageId || req.query.id,
    }
    var params = require('underscore').clone(req.params);
    params.app = req.data;
    // return res.json(params);
    res.render(pageRoot + page, params);
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        if (req.method == 'GET' && !/^\/api/.test(req.path)) {
            res.render('error', {
                message: err.message,
                error: err
            });
        } else {
            res.json({
                errorMsg: err.message
            })
        }
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;

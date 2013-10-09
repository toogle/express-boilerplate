/*
 * Copyright (C) 2013  Andrew A. Usenok                                             
 */

'use strict';

var express = require('express');
var app = module.exports = express();

var env = app.get('env');
var eson = require('eson');
var conf = eson()
    .use(eson.args())
    .use(eson.replace('{root}', __dirname))
    .use(eson.ms)
    .use(eson.bools)
    .read(__dirname + '/config/' + env + '.json');

var mongoose = require('mongoose');
var MongoStore = require('connect-mongostore')(express);
require('express-mongoose');
mongoose.connect(conf['db']);

var passport = require('passport');

app.configure(function() {
    app.use(express.logger());
    app.use(express.compress());
    app.use(express.favicon());
    app.use(conf['static url'], express.static(conf['static dir']));
    app.use(express.bodyParser());
    app.use(express.cookieParser('CHANGE ME SOFTLY'));  // FIXME
    app.use(express.session({
        store: new MongoStore({
            mongooseConnection: mongoose.connection
        }),
        key: conf['session key'],
        cookie: { maxAge: conf['session max age'] }
    }));
    app.use(express.csrf());

    app.use(passport.initialize());
    app.use(passport.session());

    app.set('view engine', 'jade');
    app.set('views', conf['views dir']);
});
app.configure('production', function() {
    app.enable('trust proxy');
});

var load = require('express-load');
load('models')
    .then('controllers')
    .then('routes')
    .into(app);

var auth = require('./auth');
auth.twitter(
    conf.twitter['consumer key'],
    conf.twitter['consumer secret']
);
auth.facebook(
    conf.facebook['client id'],
    conf.facebook['client secret']
);

if (!module.parent) {
    app.listen(conf['port'], function() {
        console.log('Listening on port ' + conf['port'] + '...');
    });
}

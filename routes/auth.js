/*
 * Copyright (C) 2013  Andrew A. Usenok                                             
 */

'use strict';

module.exports = function(app) {
    var passport = require('passport');
    var controllers = app.controllers;

    app.get('/', function(req, res) {
        res.render('index', { user: req.user });
    });

    app.get('/signup', controllers.auth.signup_form);
    app.post('/signup', controllers.auth.signup);
    app.get('/signin', controllers.auth.signin_form);
    app.post('/signin', controllers.auth.signin);
    app.get('/signout', controllers.auth.signout);

    app.get('/auth/twitter', passport.authenticate('twitter'));
    app.get('/auth/twitter/callback',
        passport.authenticate('twitter', {
            successRedirect: '/',
            failureRedirect: '/signin'
        })
    );

    app.get('/auth/facebook', passport.authenticate('facebook'));
    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect: '/',
            failureRedirect: '/signin'
        })
    );
};

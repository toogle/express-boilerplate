/*
 * Copyright (C) 2013  Andrew A. Usenok                                             
 */

'use strict';

var passport = require('passport');
var User = require('mongoose').model('User');

module.exports.authenticated = function(req, res, next) {
    if (req.user) {
        next();
    } else {
        res.redirect('/signin?back=' + req.originalUrl);
    }
};

module.exports.signup_form = function(req, res, next) {
    if (req.user) {
        res.redirect('/');
    } else {
        res.render('signup', { csrfToken: req.csrfToken() });
    }
};

module.exports.signup = function(req, res, next) {
    if (req.body.password != req.body.passwordCheck) {
        return res.render('signup', {
            error: 'Passwords are different',
            username: req.body.username,
            email: req.body.email,
            csrfToken: req.csrfToken()
        });
    }

    User.findOne({ username: req.body.username }, function(err, user) {
        if (err) { return next(err); }

        if (user) {
            res.render('signup', {
                error: 'Username is already in use',
                username: req.body.username,
                email: req.body.email,
                csrfToken: req.csrfToken()
            });
        } else {
            user = new User({
                username: req.body.username,
                email: req.body.email
            });
            user.setPassword(req.body.password, function(err) {
                if (err) { return next(err); }

                user.save(function(err, user) {
                    if (err) { return next(err); }

                    req.login(user, function(err) {
                        if (err) { return next(err); }

                        res.redirect('/');
                    });
                });
            });
        }
    });
};

module.exports.signin_form = function(req, res, next) {
    if (req.user) {
        res.redirect(req.query.back || '/');
    } else {
        res.render('signin', {
            back: req.query.back,
            csrfToken: req.csrfToken()
        });
    }
};

module.exports.signin = function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
        if (err) { return next(err); }

        if (user) {
            req.login(user, function(err) {
                if (err) { return next(err); }

                res.redirect(req.body.back || '/');
            });
        } else {
            res.render('signin', {
                error: info.message,
                username: req.body.username,
                back: req.body.back,
                csrfToken: req.csrfToken()
            });
        }
    })(req, res, next);
};

module.exports.signout = function(req, res, next) {
    req.logout();
    res.redirect('/');
};

/*
 * Copyright (C) 2013  Andrew A. Usenok                                             
 */

'use strict';

module.exports = new function() {
    var passport = require('passport');
    var LocalStrategy = require('passport-local').Strategy;
    var User = require('mongoose').model('User');

    passport.serializeUser(function(user, done) {
        done(null, user.toObject());
    });

    passport.deserializeUser(function(obj, done) {
        done(null, User(obj));
    });

    passport.use(new LocalStrategy(
        function(username, password, done) {
            User.findOne({
                username: username,
                provider: 'local',
                active: true
            }, function(err, user) {
                if (err) { return done(err); }

                if (user) {
                    user.checkPassword(password, function(err, ok) {
                        if (err) { return done(err); }

                        if (ok) {
                            done(null, user);
                        } else {
                            done(null, false, { message: 'Invalid username or password' });
                        }
                    });
                } else {
                    done(null, false, { message: 'Invalid username or password' });
                }
            });
        }
    ));

    this.twitter = function(consumerKey, consumerSecret) {
        var TwitterStrategy = require('passport-twitter').Strategy;

        passport.use(new TwitterStrategy({
            consumerKey: consumerKey,
            consumerSecret: consumerSecret,
            callbackURL: 'http://www.example.com/auth/twitter/callback'  // FIXME
        }, function(token, tokenSecret, profile, done) {
            User.findOne({
                username: profile.username,
                provider: profile.provider,
                active: true
            }, function(err, user) {
                if (err) { return done(err); }

                if (user) {
                    done(null, user);
                } else {
                    user = new User({
                        username: profile.username,
                        provider: profile.provider,
                    });
                    user.save(function(err, user) {
                        if (err) { return done(err); }

                        done(null, user);
                    });
                }
            });
        }));
    };

    this.facebook = function(clientID, clientSecret) {
        var FacebookStrategy = require('passport-facebook').Strategy;

        passport.use(new FacebookStrategy({
            clientID: clientID,
            clientSecret: clientSecret,
            callbackURL: 'http://www.example.com/auth/facebook/callback'  // FIXME
        }, function(accessToken, refreshToken, profile, done) {
            User.findOne({
                username: profile.username,
                provider: profile.provider,
                active: true
            }, function(err, user) {
                if (err) { return done(err); }

                if (user) {
                    done(null, user);
                } else {
                    user = new User({
                        username: profile.username,
                        provider: profile.provider,
                    });
                    user.save(function(err, user) {
                        if (err) { return done(err); }

                        done(null, user);
                    });
                }
            });
        }));
    };
};

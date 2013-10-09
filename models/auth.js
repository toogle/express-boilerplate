/*
 * Copyright (C) 2013  Andrew A. Usenok                                             
 */

'use strict';

var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var userSchema = new mongoose.Schema({
    username: { type: String, trim: true },
    password: String,
    email: { type: String, match: /^([a-z0-9_\.\-])+\@(([a-z0-9\-])+\.)+([a-z]{2,4})+$/i },
    provider: { type: String, default: 'local' },
    active: { type: Boolean, default: true },
    created_at: { type: Date, default: Date.now }
});

userSchema.index({ username: 1, provider: 1, active: 1 });

userSchema.methods.setPassword = function(password, done) {
    var user = this;

    bcrypt.hash(password, 8, function(err, hash) {
        if (!err) {
            user.password = hash;
        }
        if (done) {
            done(err);
        }
    });
};

userSchema.methods.checkPassword = function(password, done) {
    bcrypt.compare(password, this.password, done);
};

module.exports.User = mongoose.model('User', userSchema);

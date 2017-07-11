/**
 * Created by Administrator on 2017/7/11 0011.
 */
var express = require('express');
var app =express();

var fileStore = require('session-file-store')(session);

var identityKey = 'skey';

app.use(session({
    name:identityKey,
    secret:'lmBlog',
    saveUninitialized:false,
    resave:false,
    cookies:{
        maxAge: 10 * 1000
    }
}));

module.exports={};
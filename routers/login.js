var sha1 = require('sha1');
var express = require('express');
var router = express.Router();
var userModel = require('../model/users');
var checkNotLogin = require('../middlewares/check').checkNotLogin;

router.get('/',checkNotLogin,function (req, res, next) {
    res.render('login');
});

router.post('/',checkNotLogin,function (req, res, next) {
    var name = req.fields.name;
    var password = req.fields.password;

    userModel.getUserByName(name).then(function (user) {
        if(!user)
        {
            req.flash('error','用户不存在');
            return res.redirect('back');
        }
        if(sha1(password) !== user.password){
            req.flash('error','用户名或密码错误');
            return res.redirect('back');
        }
        req.flash('success','登陆成功');
        delete user.password;
        req.session.user = user;
        res.redirect('/main');
    }).catch(next);
});

module.exports = router;
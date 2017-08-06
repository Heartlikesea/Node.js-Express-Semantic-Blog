var fs = require('fs');
var path = require('path');
var sha1 = require('sha1');
var express = require('express');
var router = express.Router();
var svgCaptcha = require("svg-captcha");
var userModel = require('../model/users');
var checkNotLogin = require('../middlewares/check').checkNotLogin;
router.get('/', checkNotLogin, function(req, res, next) {

    // 验证码，对了有两个属性，text是字符，data是svg代码
    var code = svgCaptcha.create({
        // 翻转颜色
        inverse: false,
        // 字体大小
        fontSize: 36,
        // 噪声线条数
        noise: 3,
        // 宽度
        width: 80,
        // 高度
        height: 30,
    });

    // 保存到session,忽略大小写
    req.session["captchas"] = code.text.toLowerCase();
    res.render('register',{
        code:code.data
    })

});

router.post('/', checkNotLogin, function(req, res, next) {
    var name = req.fields.name;
    var gender = req.fields.gender;
    var bio = req.fields.bio;
    // var avatar = req.files.avatar.path.split(path.sep).pop();
    var password = req.fields.password;
    var repassword = req.fields.repassword;
    var captcha = req.fields.captcha;
    try{
        if(!(name.length >= 1 && name.length <= 10))
        {
            throw new Error('名字限制在1-10个字符');
            console.error('名字限制在1-10个字符');
        }
        if(['m','f','x'].indexOf(gender)=== -1)
        {
            throw new Error('性别只能是m、f或x');
            console.error('性别只能是m、f或x');
        }
        if(!(bio.length >= 1 && bio.length <= 30))
        {
            throw new Error('个人简介限制在1-30个字符');
            console.error('个人简介限制在1-30个字符');
        }
        // if(!req.files.avatar.name)
        // {
        //     throw new Error('缺少头像');
        //     console.error('缺少头像');
        // }
        if(password.length < 6)
        {
            throw new Error('密码至少6个字符');
            console.error('密码至少6个字符');
        }
        if(password !== repassword)
        {
            throw new Error('两次输入密码不一致');
            console.error('两次输入密码不一致');
        }
        if(captcha !== req.session.captchas)
        {
            console.error('captcha  ：'+captcha);
            console.error('req.session.captcha  ：'+req.session.captchas);
            console.error('验证码错误');
            throw new Error('验证码错误');
        }
    }catch(e)
    {
        // fs.unlink(req.files.avatar.path);
        req.flash('error',e.message);
        console.error('catch(e)'+e.message);
        return res.redirect('/register');
    }
    password = sha1(password);
    var user = {
        name : name,
        password : password,
        gender:gender,
        bio:bio,
        // avatar:avatar,
        admin:false
    };
    userModel.create(user).then(function (result) {
        var userResult = result.ops[0];
        delete user.password;
        req.session.user = user;
        req.flash('success','注册成功');
        res.redirect('/main');
    }).catch(function (e) {
        // fs.unlink(req.files.avatar.path);
        if(e.message.match('E11000 duplicate key'))
        {
            req.flash('error','用户名已被占用');
            console.error('用户名已被占用');
            return res.redirect('/register');
        }
        next(e);
    });
});

module.exports = router;
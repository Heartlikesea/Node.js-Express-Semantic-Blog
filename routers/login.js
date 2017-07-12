/**
 * Created by Administrator on 2017/6/12 0012.
 */
var express = require('express');
var userDBs = require('../model/userDB');

var router = express.Router();
var responseData = null;


router.use(function (req, res, next) {
   responseData = {
       code:0,
       message:'',
       userInfo:''
   };
   next();
});

router.post('/user/login',function(req,res,next){
    //console.log(req.body);
    var username=req.body.username;
    var password=req.body.password;

    if(username==''||password==''){
        responseData.code=1;
        responseData.message='用户名和密码不得为空！';
        res.json(responseData);
        return;
    }

    // 查询用户名和对应密码是否存在，如果存在则登录成功
    userDBs.findOne({
        username:username,
        password:password
    }).then(function(userInfo){
        if(!userInfo){
            responseData.code=2;
            responseData.message='用户名或密码错误！';
            res.json(responseData);
            return;
        }else {
            responseData.message = '登录成功！';
            responseData.userInfo = userInfo.username;
            //每当用户访问站点，将保存用户信息。
            req.session.user=userInfo;
            console.warn(req.session.user);
            console.warn(req.session.user.username);

            res.json(responseData);
            return;
        }
    });

});

router.post('/user/register',function (req, res, next) {
    var username = req.body.username;
    var password = req.body.password;
    var repassword = req.body.repassword;

    if(username == '')
    {
        responseData.code = 1;
        responseData.message = '用户名不得为空!';
        res.json(responseData);
        return;
    }
    if(password == '')
    {
        responseData.code = 2;
        responseData.message = '密码不得为空!';
        res.json(responseData);
        return;
    }
    if(password !== repassword)
    {
        responseData.code = 3;
        responseData.message = '两次密码不一致!';
        res.json(responseData);
        return;
    }
    userDBs.findOne({
      username:username
    }).then(function (userInfo) {
       if(userInfo)
       {
           responseData.code = 4;
           responseData.message = '该用户已被注册!';
           res.json(responseData);
           return;
       }else
       {
           var user = new userDBs({
               username:username,
               password:password
           });
           return user.save();
       }
    }).then(function (newUserInfo) {
        responseData.message = '注册成功!';
        res.json(responseData);
        return;
    });

});

router.get('/user/logout',function (req, res) {
    req.session.destroy(function (err) {
        if(err)
        {
            responseData.code=5;
            responseData.message='退出失败！';
            res.json(responseData);
            return;
        }
        req.session.loginUser = null;
        responseData.code=0;
        responseData.message='退出成功！';
    });
    res.json(responseData);
    return;
});

module.exports = router;
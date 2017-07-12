/**
 * Created by Administrator on 2017/6/12 0012.
 */
var express = require('express');
var router = express.Router();
var categoriesDBs = require('../model/categoriesDB');
router.get('/',function (req, res, next) {
    var session = req.session;
    var loginUser = session.loginUser;
    var isLogined = !!loginUser;
    if(req.session.user)
    {
        categoriesDBs.find().then(function (info) {
            res.render('main/index',{
                userInfo:req.userInfo,
                categories:info.reverse()
            });
        });
        console.warn('isLogined = false'+loginUser);
    }else
    {        categoriesDBs.find().then(function (info) {
        res.render('main/index',{
            userInfo:req.userInfo,
            categories:info.reverse()
        });
    });
        console.warn('isLogined = true'+loginUser);
    }


});

module.exports = router;
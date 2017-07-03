/**
 * Created by Administrator on 2017/6/12 0012.
 */
var express = require('express');
var router = express.Router();
var userDBs = require('../model/userDB');
router.use(function (req,res,next) {
    if(!req.userInfo.isAdmin)
    {
        res.send('不是管理员！');
        return
    }else
        next();
});
router.get('/',function (req, res, next) {
    res.render('admin/index',{
        userInfo:req.userInfo
    });
});
router.get('/user',function (req, res, next) {
    var page = req.query.page || 1;
    var limit = 1;
    var count = 0;


    userDBs.count().then(function (usersCount) {
        count =usersCount;
        var pages = Math.ceil(count/limit);
        page = Math.min(page,pages);
        page = Math.max(page,1);
        var skip = (page - 1) * limit;
        userDBs.find().limit(limit).skip(skip).then(function (user) {
            res.render('admin/userManager',{
                userInfo:req.userInfo,
                users:user,
                page:page,
                pages:pages,
                limit:limit,
                count:count,
                type:'user'
            })
        });
    });

});


router.get('/category',function (req, res, next) {
    res.render('admin/category',{
        userInfo:req.userInfo
    });
});

module.exports = router;
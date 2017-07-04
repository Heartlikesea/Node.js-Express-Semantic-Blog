/**
 * Created by Administrator on 2017/6/12 0012.
 */
var express = require('express');
var router = express.Router();

function renderAdminTable(obj,type,limit) {
    router.get('/'+type,function (req, res, next) {
        var page = req.query.page || 1;
        var count = 0;


        obj.count().then(function (usersCount) {
            count =usersCount;
            var pages = Math.ceil(count/limit);
            page = Math.min(page,pages);
            page = Math.max(page,1);
            var skip = (page - 1) * limit;
            obj.find().limit(limit).skip(skip).then(function (user) {
                res.render('admin/'+type+'Manager',{
                    userInfo:req.userInfo,
                    users:user,
                    page:page,
                    pages:pages,
                    limit:limit,
                    count:count,
                    type:type
                })
            });
        });

    });
}

var userDBs = require('../model/userDB');
renderAdminTable(userDBs,'user',1);
var categoriesDBs = require('../model/categoriesDB');
renderAdminTable(categoriesDBs,'category',2);


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


router.get('/category',function (req, res, next) {
    res.render('admin/category',{
        userInfo:req.userInfo
    });
});

router.get('/category/add',function(req,res,next){
    res.render('admin/categoryAdd',{
        userInfo:req.userInfo
    });
});

router.post('/category/add',function(req,res,next){
    var name = req.body.categoryName || '';
    if(name === '')
    {
        res.render('admin/error',{
           userInfo:req.userInfo,
            message:'提交的内容不得为空！！！',
            operations:{
               url:'javascript:window.history.back()',
                operation:'返回上一步'
            }
        });
    }else{
        categoriesDBs.findOne({
            name:name
        }).then(function (user) {
            if(user)
            {
                res.render('admin/error',{
                    userInfo:req.userInfo,
                    message:'已经有该分类了！！！',
                    operations:{
                        url:'javascript:window.history.back()',
                        operation:'返回上一步'
                    }
                });
                return Promise.reject();
            }else
            {
                return new categoriesDBs({
                    name:name
                }).save();
            }

        }).then(function (newName) {
            res.render('admin/success',{
                userInfo:req.userInfo,
                message:'分类保存成功！！！',
                operations:{
                    url:'javascript:window.history.back()',
                    operation:'返回上一步'
                }
            })
        });

    }
});

module.exports = router;
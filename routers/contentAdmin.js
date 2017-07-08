/**
 * Created by Administrator on 2017/7/7 0007.
 */
/**
 * Created by Administrator on 2017/6/12 0012.
 */
var express = require('express');
var router = express.Router();
var contentDBs = require('../model/contentDB');
router.get('/',function (req, res, next) {
    res.render('admin/content',{
        userInfo:req.userInfo
    });

});

router.get('/add',function (req, res, next) {
    categoriesDBs.find().then(function (categoryInfo) {
        res.render('admin/catentAdd',{
            userInfo:req.userInfo,
            categories:categoryInfo
        })
    })
});

router.post('/add',function (req, res, next) {
    console.log(req.body);
    if(req.body.categories.trim() =='')
    {
        res.render('admin/error',{
            userInfo:req.userInfo,
            message:'分类信息不存在!!',
            operations:{
                url:'javascript:window.history.back()',
                operation:'返回上一步!'
            }
        })
        return Promise.resolve();
    }
    if(req.body.title.trim() ==''){
        res.render('admin/error',{
            userInfo:req.userInfo,
            message:'标题不能为空!!',
            operations:{
                url:'javascript:window.history.back()',
                operation:'返回上一步!'
            }
        })
        return Promise.resolve();
    }
    if(req.body.content.trim()==''){
        res.render('admin/error',{
            userInfo:req.userInfo,
            message:'内容忘了填!!',
            operations:{
                url:'javascript:window.history.back()',
                operation:'返回上一步!'
            }
        });
        return Promise.resolve();
    }
    if(req.body.description.trim()==''){
        res.render('admin/error',{
            userInfo:req.userInfo,
            message:'内容忘了填!!',
            operations:{
                url:'javascript:window.history.back()',
                operation:'返回上一步!'
            }
        });
        return Promise.resolve();
    }

    new contentDBs({
        category:req.body.categories,
        title:req.body.title,
        description:req.body.description,
        content:req.body.content,
        date:new Date().toDateString()
    }).save().then(function(){
        res.render('admin/success',{
            userInfo:req.userInfo,
            message:'文章发布成功!!',
            operations:{
                url:'javascript:window.history.back()',
                operation:'返回上一步!'
            }
        })
    })

});
router.get('/content',function (req, res, next) {
    var page = req.query.page || 1;
    var limit = 2;
    var count = 0;


    contentDBs.count().then(function (usersCount) {
        count =usersCount;
        var pages = Math.ceil(count/limit);
        page = Math.min(page,pages);
        page = Math.max(page,1);
        var skip = (page - 1) * limit;
        contentDBs.find().limit(limit).skip(skip).then(function (user) {
            res.render('admin/content',{
                userInfo:req.userInfo,
                users:user,
                page:page,
                pages:pages,
                limit:limit,
                count:count,
                type:'content'
            })
        });
    });
});

router.get('/delete',function(req,res,next){
    var id=req.query.id||'';

    contentDBs.remove({
        _id:id
    }).then(function(){
        res.render('admin/success',{
            userInfo:req.userInfo,
            message:'删除文章成功！',
            operations:{
                url:'/content',
                operation:'返回分类管理'
            }
        });
    });
});

router.post('/edit',function(req,res,next){
    var id=req.query.id||'';

    contentDBs.findOne({
        _id:id
    }).then(function(contentInfo){
        if(!contentInfo){
            res.render('admin/error',{
                userInfo:req.body.userInfo,
                message:'文章id已经被删除了！',
                operations:{
                    url:'/content',
                    operation:'返回分类管理'
                }
            });
            return Promise.resolve();
        }else{
            return contentDBs.update({
                _id:id
            },{
                category:req.body.category,
                title:req.body.title,
                description:req.body.description,
                content:req.body.content
            });
        }
    }).then(function(){
        res.render('admin/success',{
            userInfo:req.body.userInfo,
            message:'修改成功！',
            operations:{
                url:'/content',
                operation:'返回分类管理'
            }
        });
    });
});
module.exports = router;
/**
 * Created by Administrator on 2017/7/5 0005.
 */
var express = require('express');
var router = express.Router();
var categoriesDBs = require('../model/categoriesDB');
router.get('/',function (req, res, next) {
    res.render('admin/categoryAdmin/category',{
        userInfo:req.userInfo
    });
});

router.get('/add',function(req,res,next){
    res.render('admin/categoryAdmin/categoryAdd',{
        userInfo:req.userInfo
    });
});

router.post('/add',function(req,res,next){
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
                return Promise.reject('已经有该分类了');
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

router.get('/categories',function (req, res, next) {
    var page = req.query.page || 1;
    var limit = 2;
    var count = 0;


    categoriesDBs.count().then(function (usersCount) {
        count =usersCount;
        var pages = Math.ceil(count/limit);
        page = Math.min(page,pages);
        page = Math.max(page,1);
        var skip = (page - 1) * limit;
        categoriesDBs.find().limit(limit).skip(skip).then(function (user) {
            res.render('admin/categoryAdmin/categoriesManager',{
                userInfo:req.userInfo,
                users:user,
                page:page,
                pages:pages,
                limit:limit,
                count:count,
                type:'categoriesManager'
            })
        });
    });
});

router.get('/edit',function(req,res,next){
    var id = req.query.id || '';
    if(!id)
    {
        res.render('admin/error',{
            userInfo:req.userInfo,
            message:'Id错误!!!',
            operations:{
                url:'javascript:window.history.back()',
                operation:'返回上一步'
            }
        });
        return Promise.resolve('Id错误');
    }
    categoriesDBs.findOne({
        _id:id
    }).then(function(categoryInfo){
        if(!categoryInfo){
            res.render('admin/error',{
                userInfo:req.userInfo,
                message:'分类信息不存在',
                operations:{
                    url:'javascript:window.history.back()',
                    operation:'返回上一步'
                }
            });
            return Promise.resolve('分类信息不存在');
        }else
        {
            res.render('admin/categoryAdmin/edit',{
                userInfo:req.userInfo,
                category:categoryInfo
            });
        }
    })
});

router.post('/edit',function(req,res,next){
    var id = req.query.id||'';
    var name = req.body.name || '';
    if(!id)
    {
        res.render('admin/error',{
            userInfo:req.userInfo,
            message:'Id错误!!!',
            operations:{
                url:'javascript:window.history.back()',
                operation:'返回上一步'
            }
        });
        return Promise.resolve('Id错误');
    }
    categoriesDBs.findOne({
        _id : id
    }).then(function (categoryInfo) {
        if(!categoryInfo)
        {
            res.render('admin/error',{
                userInfo:req.userInfo,
                message:'分类信息不存在',
                operations:{
                    url:'javascript:window.history.back()',
                    operation:'返回上一步'
                }
            });
            return Promise.resolve('分类信息不存在');
        }else
        {
            if(name === categoryInfo.name)
            {
                res.render('admin/success',{
                    userInfo:req.body.userInfo,
                    message:'修改成功！！！',
                    operations:{
                        url:'/category/categories',
                        operation:'返回分类管理'
                    }
                });
                return Promise.resolve();
            }else
            {
                categoriesDBs.findOne({
                    _id:{$ne:id},
                    name:name
                }).then(function (same) {
                    if(same)
                    {
                        res.render('admin/error',{
                            userInfo:req.body.userInfo,
                            message:'已经存在同名数据！！！',
                            operations:{
                                url:'javascript:window.history.back()',
                                operation:'返回上一步'
                            }
                        });
                        return Promise.resolve('已经存在同名数据');
                    }else
                    {
                        categoriesDBs.update({
                            _id:id
                        },{
                            name:name
                            }
                        ).then(function () {
                            res.render('admin/success',{
                                userInfo:req.body.userInfo,
                                message:'修改成功!!!',
                                operations:{
                                    url:'/category/categories',
                                    operation:'返回分类管理'
                                }
                            })
                        })
                    }

                })
            }
        }
    })
});

router.get('/delete',function (req, res, next) {
   var id = req.query.id||'';
    if(!id)
    {
        res.render('admin/error',{
            userInfo:req.userInfo,
            message:'Id错误!!!',
            operations:{
                url:'javascript:window.history.back()',
                operation:'返回上一步'
            }
        });
        return Promise.resolve('Id错误');
    }
    categoriesDBs.findOne({
        _id:id
    }).then(function (categoryInfo) {
        if(!categoryInfo)
        {
            res.render('/admin/error',{
                userInfo:req.body.userInfo,
                message:'该分类不存在数据库中！！！',
                operations:{
                    url:'/category/categories',
                    operation:'返回分类管理'
                }
            });
            return Promise.resolve('该分类不存在数据库中');
        }else{
            return categoriesDBs.remove({
                _id:id
            })
        }
    }).then(function () {
        res.render('admin/success',{
            userInfo:req.userInfo,
            message:'删除分类成功!!!',
            operations:{
                url:'/category/categories',
                operation:'返回分类管理'
            }
        });
    })
});

module.exports = router;
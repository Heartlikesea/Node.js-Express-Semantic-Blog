var express = require('express');
var router = express.Router();
var categoryModel = require('../model/categories');
var checkLogin = require('../middlewares/check').checkLogin;

router.get('/categoryAdd',checkLogin,function (req, res, next) {
    res.render('admin/categoryAdd');
});
router.post('/categoryAdd',checkLogin,function (req, res, next) {
    var reqName = req.fields.name;
    if(!reqName){
        req.flash('error','提交的内容不得为空');
        return res.redirect('back');
    }else{
        var name = {
            name:reqName,
            remark:req.fields.remark
        }
        categoryModel.create(name).then(function () {
            req.flash('success','添加成功');
            res.redirect('back');
        }).catch(function (e) {
            console.error(e.message);
            if(e.message.match('E11000 duplicate key')){
                req.flash('error','已有该分类');
                return res.redirect('back');
            }
            next(e);
        })
    }
    console.error(req.fields.name);
});
router.get('/category',checkLogin,function (req, res, next) {
   categoryModel.getCategories().then(function (categoryInfo) {
       res.render('admin/category',{
           categories:categoryInfo
       })
   }).catch(next);
});
router.get('/:id/edit',checkLogin,function (req, res, next) {
    var id = req.params.id;
    if(!id){
        req.flash('error','Id错误');
        return res.redirect('back');
    }
    categoryModel.getCategoryById(id).then(function (categoryInfo) {
        if(!categoryInfo)
        {
            req.flash('error','该分类不存在');
            return res.redirect('back');
        }else{
            res.render('admin/categoryEdit',{
                categoryInfo:categoryInfo
            })
        }
    }).catch(next);
});

router.post('/:id/edit',checkLogin,function (req, res, next) {
    var id = req.params.id;
    var name = req.fields.name;
    var newRemark = req.fields.remark;
    if(!id)
    {
        req.flash('error','Id错误');
        return res.redirect('back');
    }
    if(!name)
    {
        req.flash('error','分类名不得为空');
        return res.redirect('back');
    }
    var newName = {
        name:name,
        remark:newRemark
    };
    categoryModel.edit(id,newName).then(function () {
        req.flash('success','编辑文章成功');
        return res.redirect('/admins/category');
    }).catch(next);
});
router.get('/:id/delete',checkLogin,function (req, res, next) {
    var id = req.params.id;
    categoryModel.deleteCategory(id).then(function () {
        req.flash('success','删除文章成功');
        res.redirect('/admins/category');
    }).catch(next);
});
module.exports = router;
/**
 * Created by Administrator on 2017/7/10 0010.
 */
var express = require('express');
var router = express.Router();
var categoryDBs = require('../model/categoriesDB');
var contentDB = require('../model/contentDB');

router.get('/',function (req, res, next) {
    var data = {
        userInfo:req.userInfo,
        categories:[],
        count:0,
        page:Number(req.query.page||1),
        limit:3,
        pages:0
    };
    categoryDBs.find().then(function (categoryInfo) {
        data.categories=categoryInfo;
        return contentDB.count();
    }).then(function (count) {
        data.count=count;
        data.pages=Math.ceil(data.count/data.limit);
        data.page = Math.min(data.page,data.pages);
        data.page = Math.max(data.page,1);

        var skip = (data.page-1)*data.limit;

        return contentDB.find().limit(data.limit).skip(skip).populate(['category','user']).sort(_id);
    }).then(function (contentInfos) {
        data.content = contentInfos;
        console.log(data);
        res.render('main/article',data);
    })
});

router.get('/view',function (req, res, next) {
    var contentId = req.query.contenId||'';
    var data={
        userInfo:req.userInfo,
        categories:[],
        content:null
    };
    categoryDBs.find().then(function (categoryInfo) {
        data.categories=categoryInfo;
        return contentDB.findOne({_id:contentId});
    }).then(function (contentInfo) {
        data.content=contentInfo;
        console.log(data);
        res.render('main/view',data);
    });
});

module.exports = router;
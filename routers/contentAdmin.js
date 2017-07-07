/**
 * Created by Administrator on 2017/7/7 0007.
 */
/**
 * Created by Administrator on 2017/6/12 0012.
 */
var express = require('express');
var router = express.Router();
var categoriesDBs = require('../model/categoriesDB');
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
   console.warn(req.body);
});

module.exports = router;
/**
 * Created by Administrator on 2017/6/12 0012.
 */
var express = require('express');
var router = express.Router();
var categoriesDBs = require('../model/categoriesDB');
router.get('/',function (req, res, next) {
    categoriesDBs.find().then(function (info) {
        res.render('main/index',{
            userInfo:req.userInfo,
            categories:info
        });
    });

});

module.exports = router;
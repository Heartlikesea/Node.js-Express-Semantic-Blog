/**
 * Created by Administrator on 2017/6/12 0012.
 */
var express = require('express');
var router = express.Router();

router.get('/',function (req, res, next) {
    res.render('main/index',{
        userInfo:req.userInfo
    });
});

module.exports = router;
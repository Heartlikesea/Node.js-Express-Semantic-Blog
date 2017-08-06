var express = require('express');
var router = express.Router();
var postsModel = require('../model/posts');


router.get('/',function (req,res,next)
{
    var cearchName = req.query.cearchName;
    postsModel.cearchArticle(cearchName.toString()).then(function (info) {
        res.render('cearch',{
            posts:info
        })
    }).catch(next);
});


module.exports = router;
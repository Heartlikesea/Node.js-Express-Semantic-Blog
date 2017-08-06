var express = require('express');
var router = express.Router();
var postsModel = require('../model/posts');
var commentModel = require('../model/comments');
var checkLogin = require('../middlewares/check').checkLogin;


router.get('/',function (req, res, next) {

    var author = req.query.author;
    postsModel.getArticles(author).then(function (posts) {
        res.render('main',{
            posts:posts
        });
    }).catch(next);
});

router.post('/',checkLogin,function (req, res, next) {
    var author = req.session.user._id;
    var title = req.fields.title;
    var content = req.fields.content;

    try{
        if(!title.length)
        {
            throw new Error('请填写标题');
        }
        if(!content.length)
        {
            throw new Error('请填写内容');
        }
    }catch(e)
    {
        req.flash('error',e.message);
        return res.redirect('back');
    }
    var article = {
        author:author,
        title:title,
        content:content,
        pv:0
    };
    postsModel.create(article).then(function (result) {
        article = result.ops[0];
        req.flash('success','发表成功');
        res.redirect(`/main/${article._id}`);
    }).catch(next);
});

router.get('/create',checkLogin,function (req, res, next) {
    res.render('article');
});

router.get('/:postId',function(req,res,next){
   var postId = req.params.postId;
   Promise.all([
       postsModel.getArticleById(postId),
       commentModel.getComments((postId)),
       postsModel.incPv(postId)
   ]).then(function (result) {
       var post = result[0];
       var comments = result[1];
       if(!post)
       {
           throw new Error('该文章不存在');
       }
       res.render('post',{
           post:post,
           comments:comments
       });
   })
       .catch(next);
});

router.get('/:postId/edit',checkLogin,function (req, res, next) {
    var postId = req.params.postId;
    var author = req.session.user._id;

    postsModel.getRawPostById(postId).then(function (post) {
        if(!post)
        {
            throw new Error('该文章不存在');
        }
        if(author.toString() !== post.author._id.toString()){
            throw new Error('权限不足');
        }
        res.render('edit',{
            post:post
        });
    })
        .catch(next);
});
router.post('/:postId/edit',checkLogin,function (req, res, next) {
    var postId = req.params.postId;
    var author = req.session.user._id;
    var title = req.fields.title;
    var content = req.fields.content;

    postsModel.updatePostById(postId,author,{title:title,content:content}).then(function () {
        req.flash('success','编辑文章成功');
        res.redirect(`/main/${postId}`);
    })
        .catch(next);
});


router.get('/:postId/remove', checkLogin, function(req, res, next) {
    var postId = req.params.postId;
    var author = req.session.user._id;
    postsModel.deletePostById(postId,author).then(function () {
        req.flash('success','删除文章成功');
        res.redirect('/main');
    })
        .catch(next);
});

router.post('/:postId/comment', checkLogin, function(req, res, next) {
    var author = req.session.user._id;
    var postId = req.params.postId;
    var content = req.fields.content;
    var comment = {
        author:author,
        postId:postId,
        content:content
    };
    commentModel.create(comment).then(function () {
        req.flash('success','留言成功');
        res.redirect('back');
    })
        .catch(next);
});

router.get('/:postId/comment/remove', checkLogin, function(req, res, next) {
    var commentId = req.params.commentId;
    var author = req.session.user._id;
    commentModel.deleteCommentById(commentId,author).then(function () {
        req.flash('success','删除留言成功');
        res.redirect('back');
    })
        .catch(next);
});



module.exports = router;
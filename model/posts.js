var marked = require('marked');
var Article = require('../lib/mongo').Article;
var CommentModel = require('./comments');

Article.plugin('addCommentsCount',{
    afterFind: function (posts) {
        return Promise.all(posts.map(function (post) {
            return CommentModel.getCommentsCount(post._id).then(function (commentsCount) {
                post.commentsCount = commentsCount;
                return post;
            });
        }));
    },
    afterFindOne:function (post) {
        if(post){
            return CommentModel.getCommentsCount(post._id).then(function (count) {
                post.commentsCount = count;
                return post;
            });
        }
        return post;
    }
});

Article.plugin('contentToHtml',{
    afterFind: function (posts) {
        return posts.map(function (post) {
            post.content = marked(post.content);
            return post;
        });
    },
    afterFindOne: function (post){
        if(post){
            post.content = marked(post.content);
        }
        return post;
    }
});

module.exports = {
    create:function  create(article) {
        return Article.create(article).exec();
    },

    getArticleById: function getArticleById(postId) {
        return Article.findOne({_id:postId})
            .populate({path:'author',model:'User'})
            .addCreatedAt()
            .addCommentsCount()
            .contentToHtml()
            .exec();
    },

    getArticles: function getArticles(author){
        var query = {};
        if(author)
        {
            query.author = author;
        }
        return Article.find(query)
            .populate({path:'author',model:'User'})
            .sort({_id:-1})
            .addCreatedAt()
            .addCommentsCount()
            .contentToHtml()
            .exec();
    },

    cearchArticle:function cearchArticle(name) {
        return Article.find({title:{$regex:name}}).exec();
    },

    incPv: function incPv(postId){
        return Article.update({_id:postId},{$inc:{pv:1}}).exec();
    },

    getRawPostById : function getRawPostById(postId){
        return Article.findOne({_id: postId})
            .populate({path:'author',model:'User'})
            .exec();
    },

    updatePostById:function  updatePostById(postId,author,data) {
        return Article.update({author:author,_id:postId},{$set:data}).exec();
    },

    deletePostById:function deletePOstById(postId,author) {
        return Article.remove({author:author,_id:postId}).exec().then(function (res) {
            if(res.result.ok && res.result.n > 0)
            {
                return CommentModel.deleteCommentAllByPostId(postId);
            }
        })
    }

};
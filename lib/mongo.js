var moment = require('moment');
var objectIdTioTimestamp = require('objectid-to-timestamp');
var config = require('config-lite')(__dirname);
var Mongolass = require('mongolass');
var mongolass = new Mongolass();
mongolass.connect(config.mongodb);

mongolass.plugin('addCreatedAt',{
    afterFind: function (results) {
        results.forEach(function (item) {
            item.created_at = moment(objectIdTioTimestamp(item._id)).format('YYYY-MM-DD HH:mm');
        });
        return results;
    },
    afterFindOne: function (results) {
        if(results){
            results.created_at = moment(objectIdTioTimestamp(results._id)).format('YYYY-MM-DD HH:mm');
        }
        return results;
    }
});

exports.User = mongolass.model('User',{
    name:{type:'string'},
    password:{type:'string'},
    avatar:{type:'string'},
    gender:{type:'string',enum:['m','f','x']},
    bio:{type:'string'},
    admin:{type:Boolean,default:false}
});

exports.User.index({name:1},{unique:true}).exec();

exports.Article = mongolass.model('Post',{
    author:{type: Mongolass.Types.ObjectId},
    title:{type:'string'},
    content:{type:'string'},
    pv:{type:'number'},
});
exports.Article.index({author : 1,_id: -1}).exec();

exports.Comment = mongolass.model('Comment',{
    author:{type:Mongolass.Types.ObjectId},
    content:{type:'string'},
    postId:{type:Mongolass.Types.ObjectId}
});
exports.Comment.index({postId:1,_id:1}).exec();
exports.Comment.index({author:1,_id:1}).exec();

exports.Category = mongolass.model('Category',{
    name:{type:'string'},
    remark:{type:'string'}

});
exports.Category.index({name:1},{unique:true}).exec();
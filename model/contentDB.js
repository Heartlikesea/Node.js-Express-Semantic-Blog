/**
 * Created by Administrator on 2017/7/7 0007.
 */
var mongoose = require('mongoose');
var usersSchema = require('../schemas/contents');
module.exports= mongoose.model('Content',usersSchema);

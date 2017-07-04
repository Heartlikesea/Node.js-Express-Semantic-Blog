/**
 * Created by Administrator on 2017/7/4 0004.
 */
var mongoose = require('mongoose');
var usersSchema = require('../schemas/users');
module.exports= mongoose.model('Category',usersSchema);

/**
 * Created by Administrator on 2017/6/13 0013.
 */
var mongoose = require('mongoose');
var usersSchema = require('../schemas/users');
module.exports= mongoose.model('User',usersSchema);

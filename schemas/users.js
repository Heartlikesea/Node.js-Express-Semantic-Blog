/**
 * Created by Administrator on 2017/6/12 0012.
 */
var mongoose = require('mongoose');
module.exports = new mongoose.Schema({
    username:String,
    password:String,
    isAdmin:{
        type:Boolean,
        default:false
    }
});
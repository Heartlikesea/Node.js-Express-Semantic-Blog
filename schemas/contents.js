/**
 * Created by Administrator on 2017/7/7 0007.
 */
var mongoose = require('mongoose');

module.exports = new mongoose.Schema({
   category:{
       type:mongoose.Schema.Types.ObjectId,
       ref:'Category'
   },
    views:{
        type:Number,
        default:0
    },
    title:String,
    description:{
       type:String,
        defult:''
    },
    content:{
       type:String,
        default:''
    },
    date:String
});
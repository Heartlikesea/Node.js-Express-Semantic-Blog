var Category = require('../lib/mongo').Category;
module.exports = {
    create:function create(category)
    {
        return Category.create(category).exec();
    },
    getCategories :function getCategories() {
        return Category.find();
    },
    getCategoryById:function getCategoryById(id){
        return Category.findOne({_id:id}).exec();
    },
    edit:function edit(id,data){
        return Category.update({_id:id},{$set:data}).exec();
    },

    deleteCategory:function deleteCategory(id) {
        return Category.remove({_id:id}).exec();
    }
};
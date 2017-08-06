
module.exports = {
    port:3000,
    session:{
        secret:'myBlog',
        key:'myBlog',
        maxAge:1000 * 60 * 60 * 24 * 30
    },
    mongodb:'mongodb://localhost:27018/blog'
};
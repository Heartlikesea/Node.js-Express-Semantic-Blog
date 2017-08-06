module.exports = function (app) {
    app.get('/',function (req, res) {
        res.redirect('/main');
    });
    app.use('/admins',require('./admins'));
    app.use('/register',require('./register'));
    app.use('/login',require('./login'));
    app.use('/loginout',require('./loginout'));
    app.use('/main',require('./main'));
    app.use('/cearch',require('./cearch'))
    app.use(function (req,res) {
        if(!res.headersSent){
            res.status(404).render('404');
        }
    });

};

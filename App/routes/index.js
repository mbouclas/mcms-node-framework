module.exports = (function (App, Route, Package) {
    var express = require('express');
    var router = express.Router();

    var Controllers = App.Controllers[Package.packageName],
        categoryServices = App.Services['mcmsNodePages'].Category;


    var names = {
        Home: '',
        Login : 'login',
        Logout : 'logout',
        Signup : 'signup',
        facebookLogin : 'auth/facebook',
        googleLogin : 'auth/google'
    };
    Route.set(names,'');


    router.get('/',function(req, res, next) {
        var layout  = App.frontPageLayout;
        var template = (App.Config.app.maintenance) ? 'maintenance.html' : 'index.html';
        res.render(template, { layout : layout});
    });

    router.get('/login',function(req,res,next){
        res.render('Login/loginForm.html',{ Flash : req.flash()});
    });

    router.get('/logout',function(req,res,next){
        req.flash('messageSuccess','loggedOut');
        req.logout();
        res.redirect('/');
    });

    router.get('/signup',function(req, res, next) {
        res.render('Login/signup.html', { });
    });

    router.get('/contact',function(req, res, next) {
        res.render('Contact/contactForm.html', { });
    });

    router.post('/login',App.Auth.middleware.applyCSRF,App.Auth.login);
    router.get('/auth/facebook',App.Auth.facebookLogin);
    router.get('/auth/facebook/callback',App.Auth.facebookLoginCallback);

    router.get('/auth/google',App.Auth.googleLogin);
    router.get('/auth/google/callback',App.Auth.googleLoginCallback);

    return router;
});

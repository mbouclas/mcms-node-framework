module.exports = (function(App,Package,Route){
    //var models = App.Database.mongodb.loadModels(App.Database.mongodb.mongoose,__dirname + '/Models');
    var models = Package.models;
    var Auth = (Package.Auth) ? Package.Auth : App.serviceProviders.core.auth;

    Package.App.use(function(req, res, next){//Define global variables that we need in EVERY template
        //menus
        var Menu = new Package.services.Menu();
        //Add all this stuff to cache so they are not loaded every time
        App.async.parallel({
            Menu : function(callback){
                Menu.get({},callback);
            }
        },function(err,results){
            for (var a in results){
                res.locals[a] = results[a];
            }
            next();
        });


    });

    var localAuthMiddleware = Auth.middleware.local({
        successRedirect: '/userCP',
        failureRedirect: '/userCP/login'
    });

    var isAuthenticated = function (req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }

        res.redirect('/userCP/login');
    };

    Route.filter('isAuthenticated',function(req,res,next){
        return isAuthenticated(req,res,next);
    });

    Route.get('/products',{
        as : 'products',
        //middleware : isAuthenticated,
        exec : 'Product/productsCtrl.index'
    });

    var catPermalink = Route.param('catPermalink', function (req, res, next, id) {
        next();
    });

    var productID = Route.param('productID', function (req, res, next, id) {
        next();
    });

    var permalink = Route.param('permalink', function (req, res, next, id) {
        next();
    });

    Route.get('/',{
        as : 'home',
        exec : 'homeCtrl.index'
    });

    Route.get('/product/:permalink.html',{
        as : 'product',
        exec : 'Product/productsCtrl.viewProduct'
    });

    return App;
});

module.exports = (function(App,Package,Route){
    //var models = App.Database.mongodb.loadModels(App.Database.mongodb.mongoose,__dirname + '/Models');
    var models = Package.models;
    var Auth = (Package.Auth) ? Package.Auth : App.serviceProviders.core.auth;

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

    var page = Route.param('page', function (req, res, next, id) {
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

    Route.get('/addToCart/:productID.html',{
        as : 'addToCart',
        exec : 'Shop/cartCtrl.addToCart'
    });

    Route.group({prefix:'/cart',filters:[]},[
        function(){
            return {
                method : 'get',
                route:'add/:productID.html',
                as : 'addToCart',
                exec : 'Shop/cartCtrl.addToCart'
            };
        },
        function(){
            return {
                method : 'get',
                route:'clear.html',
                as : 'clearCart',
                exec : 'Shop/cartCtrl.clearCart'
            };
        },
        function(){
            return {
                method : 'get',
                route:'removeFromCart/:productID.html',
                as : 'removeFromCart',
                exec : 'Shop/cartCtrl.removeFromCart'
            };
        },
    ]);

    Route.group({prefix:'/category',filters:[]},[
        function(){
            return {
                method : 'get',
                route:':permalink.html',
                as : 'productCategory',
                exec : 'Product/productsCtrl.index'
            };
        },
        function(){
            return {
                method : 'get',
                route:':permalink/:page.html',
                as : 'productCategoryPage',
                exec : 'Product/productsCtrl.index'
            };
        }
    ]);

    return App;
});

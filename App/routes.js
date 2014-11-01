module.exports = (function(App,Package,Route){
    //var models = App.Database.mongodb.loadModels(App.Database.mongodb.mongoose,__dirname + '/Models');
    var models = Package.models;
    var Auth = (Package.Auth) ? Package.Auth : App.serviceProviders.core.auth;

    var coreServices = App.serviceProviders.core.services;
    var adminServices = Package.services;
    var eshopModels = App.serviceProviders.eshop.models;

    Route.get('/products',{
        as : 'products',
        //middleware : isAuthenticated,
        exec : 'Product/productsCtrl.index'
    });

    //console.log(product.count());

/*    var mysql = App.loadDatabaseDriver('mysql',{ driverOptions : {
        //modelsPath : __dirname + '/Models/MySQl'
    }
    }).db;
    mysql.query("SELECT * FROM brands").then(function(myTableRows) {
        console.log(myTableRows)
    });
    mysql.Brand.findAll().then(function(res){
        console.log(res)
    });*/

    var catPermalink = Route.param('catPermalink', function (req, res, next, id) {
        console.log('CALLED ONLY ONCE',id);
        /*       UserDatabase.find(user_id, function(err, user) {
         if (err) return next(err);
         if (!user) return next(...create a 404 error...);

         req.user = user;
         next()
         });*/
        next();
    });


    App.server.get('/',function (req, res) {



        models.Show.find({},function(err,res){
            console.log(res.length + ' shows found')
        });

        res.send('You are in Home');
    });

    return App;
});

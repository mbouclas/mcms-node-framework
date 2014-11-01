module.exports = (function(App){
    var models,
        Auth,
        coreServices,
        adminServices,
        eshopServices,
        eshopModels,
        async = require('async');

    function productsCtrl(){
        this.name = 'productsCtrl';
        this.nameSpace = 'Product';
        models = App.serviceProviders.admin.models;
        eshopModels = App.serviceProviders.eshop.models;
        Auth =  App.serviceProviders.core.auth;
        coreServices = App.serviceProviders.core.services;
        adminServices = App.serviceProviders.admin.services;
        eshopServices = App.serviceProviders.eshop.services;

    }

    productsCtrl.prototype.index = function(req,res,next){
        var Products  = new eshopServices.Product();

        async.parallel({
            products : function(callback){//call a service instead

                Products.getProducts({},callback);
            }
        },function(err,results){
            console.log(results)
            res.render('partials/dashboard',results);
        });


    };

    return productsCtrl;
});
module.exports = (function(App,Package){
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
        eshopModels = App.serviceProviders.eshop.models;
        Auth =  App.serviceProviders.core.auth;
        coreServices = App.serviceProviders.core.services;

        eshopServices = App.serviceProviders.eshop.services;

    }

    productsCtrl.prototype.index = function(req,res,next){
        var Products  = new eshopServices.Product();

        async.parallel({
            products : function(callback){//call a service instead

                Products.getProducts({},callback);
            }
        },function(err,results){

            res.render('partials/dashboard',results);
        });


    };

    productsCtrl.prototype.viewProduct = function(req,res,next){
        var Products  = new eshopServices.Product();

        async.parallel({
            product : function(callback){//call a service instead

                Products.getProduct({permalink: req.params.permalink },{},callback);
            }
        },function(err,results){

            res.render('Product/view',results);
        });


    };

    return productsCtrl;
});
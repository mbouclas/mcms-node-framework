module.exports = (function(App,Package) {
    var models,
        Auth,
        coreServices,
        Services,
        async = require('async'),
        Loader = new App.EagerLoader();
    var Route;
    var relationships ={};

    function homerCtrl(){
        this.name = 'homeCtrl';
        //this.nameSpace = '';
        coreServices = App.serviceProviders.core.services;
        eshopServices = App.serviceProviders.eshop.services;
        Services = Package.services;

        relationships = App.serviceProviders.eshop.modelRelationships;

    }

    homerCtrl.prototype.index = function(req,res,next){
        /*
        * Products : latest, featured, discounted, slider
        * Content : Featured, FAQ
        */

        var Products  = new eshopServices.Product();
        async.parallel({
            products : function(callback){//call a service instead
                Loader.set(Products).with([
                    relationships.categories,
                    relationships.eshop,
                    relationships.thumb
                ]).
                    exec(Products.find.bind(null,{}),callback);
                //Products.getProducts({},callback);
            }
        },function(err,results){

            res.render('partials/home',results);
        });
    };


    return homerCtrl;
});
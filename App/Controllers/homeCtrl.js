module.exports = (function(App,Package) {
    var models,
        Auth,
        coreServices,
        Services,
        async = require('async');
    var Route;

    function homerCtrl(){
        this.name = 'homeCtrl';
        //this.nameSpace = '';
        coreServices = App.serviceProviders.core.services;
        eshopServices = App.serviceProviders.eshop.services;
        Services = Package.services;



    }

    homerCtrl.prototype.index = function(req,res,next){
        /*
        * Products : latest, featured, discounted, slider
        * Content : Featured, FAQ
        */

        var Products  = new eshopServices.Product();
        async.parallel({
            products : function(callback){//call a service instead

                Products.getProducts({},callback);
            }
        },function(err,results){

            res.render('partials/home',results);
        });
    };


    return homerCtrl;
});
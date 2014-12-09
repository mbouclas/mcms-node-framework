module.exports = (function(App,Package) {
    var models,
        Auth,
        coreServices,
        adminServices,
        eshopServices,
        eshopModels,
        Cart,
        lo = App.lodash,
        async = require('async'),
        Loader = new App.EagerLoader();
    var relationships = {};


    function cartCtrl() {
        this.name = 'cartCtrl';
        this.nameSpace = 'Shop';
        eshopModels = App.serviceProviders.eshop.models;
        coreServices = App.serviceProviders.core.services;
        eshopServices = App.serviceProviders.eshop.services;
        relationships = App.serviceProviders.eshop.modelRelationships;
        Cart  = new eshopServices.Cart();
    }

    cartCtrl.prototype.addToCart = function(req,res,next){

        var productID = req.params.productID;
        var backURL = req.header('Referer') || '/';

        Cart.add(productID,{},function(err,result){
            req.flash('addedToCart', true);
            res.redirect(backURL);
        });

    };

    cartCtrl.prototype.clearCart = function(req,res,next){

        var backURL = req.header('Referer') || '/';
        Cart.clear(req);
        req.flash('clearedCart', true);
        res.redirect(backURL);
    };

    cartCtrl.prototype.removeFromCart = function(req,res,next){
        var productID = req.params.productID;
        var backURL = req.header('Referer') || '/';
        Cart.removeProduct(productID);
        req.flash('productRemoved', true);
        res.redirect(backURL);
    };

    return cartCtrl;
});
module.exports = (function(App,Package){
    var models,
        Auth,
        coreServices,
        adminServices,
        eshopServices,
        eshopModels,
        lo = App.lodash,
        async = require('async'),
        Loader = new App.EagerLoader();
        var relationships = {};


    function productsCtrl(){
        this.name = 'productsCtrl';
        this.nameSpace = 'Product';
        eshopModels = App.serviceProviders.eshop.models;
        Auth =  App.serviceProviders.core.auth;
        coreServices = App.serviceProviders.core.services;

        eshopServices = App.serviceProviders.eshop.services;
        relationships = App.serviceProviders.eshop.modelRelationships;
    }

    productsCtrl.prototype.index = function(req,res,next){
        var Products  = new eshopServices.Product();
        var page = parseInt(req.params.page) || 1;
        var limit = 10;//move it to options file
        var filters = {
            active : {
                type : 'equals',
                value : true
            }
        };
        var options = {
            sort : 'eshop.price',
            way : '-'
        };
        var Category;

//Grab the category first, then products so that we can have items/page and cat settings
        async.series({
            category: function (callback) {
                return Products.getProductCategory({permalink: req.params.permalink}, function (err, category) {

                    var catid = (category == null) ? false : category.id;
                    filters.categories = {
                        type: 'equals',
                        value : catid
                    };
                    Category = category;
                    callback(err, category);
                });
            },
            products: function (callback) {

                async.parallel({
                    products: function (cb) {
                        Loader.set(Products).with([
                            relationships.categories,
                            relationships.eshop,
                            relationships.thumb
                        ]).
                            exec(Products.find.bind(null, {
                                page: page,
                                limit: limit,
                                sort: options.sort,
                                way: options.way,
                                filters: lo.clone(filters)
                            }), cb);
                    },
                    count: Products.count.bind(null, lo.clone(filters))
                }, callback);
            }
        },function(err,results){

            res.render('partials/dashboard',lo.merge(results.products,{
                pagination : App.Helpers.Model.pagination(results.products.count,limit,page),
                category : results.category
            }));
        });
/*        async.parallel({
            products : function(callback){
                Loader.set(Products).with([
                    relationships.categories,
                    relationships.eshop,
                    relationships.thumb
                ]).
                    exec(Products.find.bind(null,{
                        page : page,
                        limit : limit,
                        sort : 'created_at',
                        way : '-',
                        filters : lo.clone(filters)
                    }),callback);
            },
            count : Products.count.bind(null,lo.clone(filters)),
            category : Products.getProductCategory.bind(null,{permalink : req.params.permalink })
        },function(err,results){
            res.render('partials/dashboard',lo.merge(results,{
                pagination : App.Helpers.Model.pagination(results.count,limit,page)
            }));
        });*/


    };

    productsCtrl.prototype.viewProduct = function(req,res,next){
        var Products  = new eshopServices.Product();

        async.parallel({
            product : function(callback){//call a service instead
                Loader.set(Products).with([
                    relationships.categories,
                    relationships.ExtraFields,
                    relationships.eshop,
                    relationships.upselling,
                    relationships.related,
                    relationships.thumb,
                    relationships.images
                ]).
                    exec(Products.findOne.bind(null,{permalink: req.params.permalink},null),callback);
                //Products.getProduct({permalink: req.params.permalink },{},callback);
            }
        },function(err,results){
            res.render('Product/view',results);
        });


    };



    return productsCtrl;
});
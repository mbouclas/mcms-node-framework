module.exports = (function(App,Package){
    function Product() {
        this.name = 'Product';
        this.withModels = [];
    }

    Product.prototype.getOne = function(args,options,callback){
        var Product = App.serviceProviders.eshop.models.Product;
        var searchBy = (typeof args == 'string') ? {id : args} : args;

        Product.findOne(searchBy,callback);
    };


    return Product;
});
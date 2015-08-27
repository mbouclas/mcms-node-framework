var Product = App.Connections.mongodb.models.Product;
Product.find({$where : 'this.mediaFiles.images.length > 0'}).exec(function(err,documents){
    var asyncArr = [],
        async = require('async');

    documents.forEach(function(product){
        asyncArr.push(function(product,next){
            for (var i in product.mediaFiles.images){
                product.mediaFiles.images[i].active = true;
                product.mediaFiles.images[i].orderBy = i;
            }

            Product.update({sku : product.sku},{$set : {'mediaFiles.images' : product.mediaFiles.images}},function (err) {
                if (err) {
                    Log.error(err);
                    return callback(err);
                }

                next(null, true);
            });
        }.bind(null,product));
    });

    async.parallel(asyncArr,function(err,results){
        console.log('Err: ',err);
    })

});
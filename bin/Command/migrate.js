module.exports = (function(App){
    var colors = require('colors');
    var moment = require('moment');
    var slug = require('slug');
    var async = App.async;
    var Products,ExtraFields,Categories,EshopItemDetails,Users;
    var idMap = {}, Product,Category,ExtraField,User,ItemDetail,Image;

    function command(){
        this.name = 'migrate';
        this.description = 'Migrates from MySQL version';
        this.options = {};
    }

    command.prototype.fire = function(callback){
        this.module = this.options['_'][1];
        Product = App.serviceProviders.eshop.models.Product;
        Category = App.serviceProviders.eshop.models.Category;
        ExtraField = App.serviceProviders.eshop.models.ExtraField;
        Image = App.serviceProviders.eshop.models.ProductImage;
        User = App.serviceProviders.core.models.User;

        switch (this.module){
            case 'products' : migrateProducts(callback);
                break;
            case 'eshop' : migrateEshop(callback);
                break;
            case 'categories' : migrateCategories(callback);
                break;
            case 'users' : migrateUser(callback);
                break;
            case 'images' : migrateImages(callback);
                break;
            default : migrateAll(callback);
                break;
        }


        //callback(null,true);
        console.log(colors.green('command ' + this.name + ' fired'));

    };

    function readFile(file){
        var json = require(App.pathName + '/Material/migrationData/'+ file + '.json');
        return json;
    }

    function createIdMap(file,oldId,newId){
        if (typeof idMap[file] == 'undefined'){
            idMap[file] = {};
        }

        idMap[file][oldId] = newId;
    }



    function insertProduct(product,callback){
        var uID = (typeof idMap.User != 'undefined' && typeof idMap.User[product.uid] != 'undefined') ? idMap.User[product.uid] : product.uid;
        var categories = [],
            extraFields = [],
            mediaFiles = {
                images : [],
                documents : [],
                videos : []
            },
            thumb = {},
            upSell = [];

        for (var a in product.categories){
            categories.push(idMap.Category[product.categories[a].categoryid]);
        }

        for (var a in product.efields){
            extraFields.push({
                fieldID : idMap.ExtraField[product.efields[a].fieldid],
                value : product.efields[a].pivot.value
            });
        }



        var temp = {
            sku : product.sku,
            title : product.title,
            permalink : product.permalink,
            uid : uID,
            description : product.description,
            description_long : product.description_long,
            active : product.active,
            settings : product.settings,
            created_at : moment.unix(product.date_added),
            updated_at : moment.unix(product.date_modified),
            ExtraFields : extraFields,
            eshop : product.eshop,
            categories : categories,
            oldID : product.id
        };

        return new Product(temp,false).save(function(err,item){
            if (err){
                console.log(err);
            }

            createIdMap('Product',product.id,item.id);
            console.log(colors.yellow(product.sku + ' ' + product.title) + ' inserted');
            callback(null,'product inserted');
        });
    }

    function insertUser(user,callback){
        var activatedAt, createdAt,updatedAt;
        activatedAt = (user.activated == null ) ? new Date : moment(user.activated_at,'YYYY-MM-DD HH:mm:ss').toDate();
        createdAt = (user.created_at == null ) ? new Date : moment(user.created_at,'YYYY-MM-DD HH:mm:ss').toDate();
        updatedAt = (user.updated_at == null ) ? new Date : moment(user.updated_at,'YYYY-MM-DD HH:mm:ss').toDate();

        var temp = {
            username : user.uname,
            password : user.pass,
            email : user.email,
            firstName : user.user_name,
            lastName : user.user_surname,
            active : user.activated,
            settings : user.settings,
            activated_at : activatedAt,
            created_at : createdAt,
            updated_at : updatedAt,
            remember_token : user.remember_token,
            userClass : user.user_class,
            preferences : user.prefs,
            activation_code : user.activation_code,
            oldID : user.id
        };

        return new User(temp).save(function(err,item){
            if (err){
                console.log(err);
            }

            createIdMap('User',user.id,item.id);
            console.log(colors.magenta(user.email) + ' inserted');
            callback(null,'user inserted');
        });
    }

    function insertCategory(cat, callback){
        var createdAt = (cat.created_at == null ) ? new Date : moment(cat.created_at,'YYYY-MM-DD HH:mm:ss').toDate();
        var updatedAt = (cat.updated_at == null ) ? new Date : moment(cat.updated_at,'YYYY-MM-DD HH:mm:ss').toDate();
        var parentID = (cat.parent_id == null) ? 0 : cat.parent_id;

        var temp = {
            category: cat.category,
            description: cat.description,
            permalink: cat.permalink,
            parentID: parentID,
            orderBy: cat.order_by,
            created_at: createdAt,
            updated_at: updatedAt,
            settings : cat.settings
        };

        return new Category(temp,false).save(function(err,item){
            if (err){
                console.log(err);
            }

            createIdMap('Category',cat.categoryid,item.id);
            console.log(colors.magenta(cat.category) + ' inserted');
            callback(null,'category inserted');
        });
    }

    function insertExtraField(efield, callback){
        var createdAt = (efield.created_at == null ) ? new Date : moment(efield.created_at,'YYYY-MM-DD HH:mm:ss').toDate();
        var updatedAt = (efield.updated_at == null ) ? new Date : moment(efield.updated_at,'YYYY-MM-DD HH:mm:ss').toDate();
        var active = (efield.active == 'Y') ? true : false;
        var categories = [],
            groups = [],
            options = [],
            settings = {};

        for (var a in efield.settings.multipleData){
            options.push(efield.settings.multipleData[a]);
        }

        for (var a in efield.categories){
            categories.push({
                catid : idMap.Category[efield.categories[a].catid],
                orderBy : efield.categories[a].orderby
            });
        }

        settings = efield.settings;
        delete settings.multipleData;
        delete settings.translations;

        var temp = {
            title: efield.field,
            varName: efield.var_name,
            permalink: efield.var_name,
            module: efield.module,
            type: efield.type,
            created_at: createdAt,
            updated_at: updatedAt,
            settings: settings,
            active: active,
            fieldOptions : options,
            categories : categories,
            groups :groups,
            oldID : efield.fieldid
        };

        return new ExtraField(temp,false).save(function(err,item){
            if (err){
                console.log('Efield error : ',err);
            }

            createIdMap('ExtraField',efield.fieldid,item.id);
            console.log(colors.magenta(efield.field) + ' inserted');
            callback(null,'Extra field inserted');
        });
    }

    function insertImages(images,callback){

        if (typeof images.length == 'undefined'){
            callback(null,'done');
            return;
        }
        var asyncArr = [],
            len = images.length;

        for (var i=0; len > i; i++){
            asyncArr.push(addImage.bind(null,images[i]));
        }


        async.parallel(asyncArr,function(err,results){
            callback(null,'product images done. ');
        });
    }

    function addImage(image,callback){

        if (typeof image.additional.length == 'undefined' || image.additional.length == 0){
            return callback('no copies',null);
        }

        var oldImageMap = {
            itemid : image.itemid,
            imageID : image.id
        };
        var copies = {};

        //first insert these images to their collection
        var createdAt = (image.additional[0].created_at == null ) ? new Date : moment.unix(image.additional[0].date_added);
        var updatedAt = createdAt;

        for (var a in image.additional){
            var copy = image.additional[a];
            copies[copy.image_type] = {
                imageUrl : copy.image_url,
                imagePath : copy.image_path,
                imageX : copy.image_x,
                imageY : copy.image_y
            }
        }

        var temp = {
            originalFile: image.original_file,
            created_at: createdAt,
            updated_at: updatedAt,
            settings: {},
            copies : copies,
            details : {},
            oldID : image.id,
            oldItemID : image.itemid
        };

        return new Image(temp,false).save(function(err,item){

            if (err){
                console.log('Image error : ',err);
                return callback('Image error : ' + item.id);
            }
            createIdMap('Images',item.id,{
                alt : image.alt,
                title : image.title
            });
            //console.log(colors.magenta(item.originalFile) + ' inserted');
            callback(null,'image added');
        });

    }

    function updateProductImages(id,callback){

        Image.find({oldItemID : id},function(err,images){
            if (images.length == 0 || images == null){
                return callback(null,'no images found for ' + id);
            }

            Product.findOne({oldID : id},function(err,doc){
                if (typeof doc == 'undefined' || doc == null){
                    return callback('not found');
                }

                var docImages = [],
                    imagesLen = images.length;

                for (var i = 0; imagesLen > i; i++){
                    var obj = {id : images[i].id};
                    if (typeof idMap.Images[images[i].id] != 'undefined'){
                        obj.alt = idMap.Images[images[i].id].alt;
                        obj.title = idMap.Images[images[i].id].title;
                    }

                    docImages.push(obj);
                }

                //doc.mediaFiles.images = docImages;
                doc.set('mediaFiles.images',docImages);
                //doc.thumb = {id : 'test'};


                doc.save(function(err){
                    if (err){
                        console.log('ERRROR: :::',err);
                    }
                    callback(null,'product updated');
                });

            });
        });
    }

    function updateProductThumb(itemID,imgID,callback){

        Image.findOne({oldID : imgID},function(err,image){
            if (image == null){
                console.log(image)
                return callback(null,'no images found for ' + imgID);
            }

            Product.findOne({oldID : itemID},function(err,doc){
                if (typeof doc == 'undefined' || doc == null){
                    return callback(null, 'not found');
                }

                var thumb = {
                    id : image.id
                };

                if (typeof idMap.Images[image.id] != 'undefined'){
                    thumb.alt = idMap.Images[image.id].alt;
                    thumb.title = idMap.Images[image.id].title;
                }

                doc.set('thumb',thumb);


                doc.save(function(err){
                    if (err){
                        console.log('ERRROR: :::',err);
                    }
                    callback(null,'product thumb updated');
                });

            });
        });
    }

    function migrateProducts(callback) {
        Products = readFile('Product');
        var asyncArr = [];

        for (var a in Products){
            asyncArr.push(insertProduct.bind(null,Products[a]));
        }
        //after insert fix UID, catids
        async.parallel(asyncArr,function(err,results){
            callback(null,'products done');
        });

    }

    function migrateImages(callback){
        var Products = readFile('Product');
        var Thumbs = readFile('Thumb');
        var asyncArr = [],
            updateProductImagesArr = [];

        var thumbsLen = Thumbs.length,
            thumbsObj = {};

        for (var i=0;thumbsLen > i;i++){
            if (Thumbs[i].thumb != null){
                thumbsObj[Thumbs[i].thumb.itemid] = Thumbs[i].thumb;
            }
        }

        for (var a in Products){
            Products[a].thumb = thumbsObj[Products[a].id];

            if (typeof Products[a].images != 'undefined'){
                asyncArr.push(insertImages.bind(null,Products[a].images));
                if (Products[a].thumb != 'undefined'){
                    asyncArr.push(insertImages.bind(null,[Products[a].thumb]));
                }

                updateProductImagesArr.push(updateProductImages.bind(null,Products[a].id));
                updateProductImagesArr.push(updateProductThumb.bind(null,Products[a].id,Products[a].thumb.id));
            }
        }

        async.parallel(asyncArr,function(err,results) {
            //lets update the products
            async.parallel(updateProductImagesArr, function(err,updateResults){
                if (err){
                    console.log(err);
                }
                callback(null,'update products done');
            });
        });
    }



    function migrateEshop(callback) {
        callback(null,true);
    }

    function migrateExtraField(callback) {
        ExtraFields = readFile('Efield');
        var asyncArr = [];

        for (var a in ExtraFields){
            asyncArr.push(insertExtraField.bind(null,ExtraFields[a]));
        }


        async.parallel(asyncArr,function(err,results){
            callback(null,'efields done');
        });

    }

    function migrateCategories(callback) {
        Categories = readFile('Category');
        var asyncArr = [];

        for (var a in Categories){
            asyncArr.push(insertCategory.bind(null,Categories[a]));
        }


        async.parallel(asyncArr,function(err,results){
            callback(null,'categories done');
        });


    }

    function migrateUser(callback) {
        Users = readFile('User');
        var asyncArr = [];

        for (var a in Users){
            asyncArr.push(insertUser.bind(null,Users[a]));
        }
        //after insert fix UID, catids
        async.parallel(asyncArr,function(err,results){
            callback(null,'users done');
        });

    }

    function migrateAll(callback) {
        var asyncArr = [
            migrateUser,
            migrateCategories,
            migrateExtraField,
            migrateProducts,
            migrateImages
            //migrateDocuments
        ];
        async.series(asyncArr,function(err,results){
            callback(null,true);
        });

    }

    return command;
});
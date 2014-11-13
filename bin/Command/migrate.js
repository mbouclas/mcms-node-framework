module.exports = (function(App){
    var colors = require('colors');
    var moment = require('moment');
    var slug = require('slug');
    var async = App.async;
    var Products,ExtraFields,Categories,EshopItemDetails,Users;
    var idMap = {}, Product,Category,ExtraField,User,ItemDetail;

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
            extraFields.push(idMap.ExtraField[product.efields[a].fieldid]);
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
            migrateProducts
            //migrateImages
            //migrateDocuments
        ];
        async.series(asyncArr,function(err,results){
            callback(null,true);
        });

    }

    return command;
});
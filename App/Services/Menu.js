module.exports = (function(App,Package){
    var Menu
    function Menu() {
        this.name = 'Menu';
        this.withModels = [];
        Menu = Package.models.Menu;
    }

    //id can be somethings like {name : 'test'}
    Menu.prototype.getOne = function(args,options,callback){

        var searchBy = (typeof args == 'string') ? {id : args} : args;
        Menu.findOne(searchBy,callback);
    };

    Menu.prototype.get = function(options,callback){
        Menu.find({},function(err,menus){
            if (err){
                callback(err,'menus');
                return;
            }

            var ret = {};
            for (var a in menus){
                ret[menus[a].alias] = menus[a];
            }

            callback(null,ret);
        });
    };


    Menu.prototype.create = function(menu,callback){

        return new Package.models.Menu(menu).save(callback);
    };

    Menu.prototype.update = function(){

    };

    Menu.prototype.delete = function(){

    };



    return Menu;
});
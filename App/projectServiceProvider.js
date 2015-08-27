module.exports = (function(App){
    var express = require('express');
    var miniApp = express();
    var path = require('path');
    var Command = App.Command(App);
    var lo = require('lodash');

    function projectServiceProvider(){
        this.packageName = 'project';
        this.services = {};
        this.controllers = {};
        this.viewsDir = __dirname + '/views';
        if (App.CLI){
            var commandFolder = path.join(__dirname , 'Commands/');
            Command.registerCommand([

            ]);

            return;
        }
        App.frontPageLayout = require(App.Config.baseDir + 'App/Storage/frontPageLayout.json');
        App.Controllers[this.packageName] = App.Helpers.services.loadService(__dirname + '/Controllers',true,this);
        App.viewEngine.registerTemplates(this.viewsDir, miniApp);
        miniApp.set('views', this.viewsDir);
        App.viewEngine.registerFilterDir(__dirname + '/viewFilters/' + App.Config.view.default);
        App.Services['mcmsNodeMenus'].Menu.addToCache(function(err,results){
        });

        miniApp.use(function(req,res,next){
            var locale = req.session.locale || App.Config.app.locale;
            res.locals.Lang = App.Lang;
            res.locals.Config = App.Config;
            res.locals.Translations = {
                userPanel : App.Lang.translations[locale].userPanel
            };
            res.locals.lo = lo;

            res.locals.Menu = App.Cache.Menu;
            next();
        });

        App.server.use(miniApp);
        require('./routes')(App, miniApp,this);
    }


    function ajaxUser(user){
        if (!user){
            return {};
        }
        var ret = lo.clone(user);
        delete ret.username;
        delete ret.uid;
        delete ret.userClass;
        return ret;
    }

    return new projectServiceProvider();
});
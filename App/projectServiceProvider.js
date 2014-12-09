module.exports = (function(App) {
    var express = require('express');
    var miniApp = express();
    var async = require('async');
    var Command = require('mcms-node-core/lib/Framework/Command/loader')(App);

    function project(){
        miniApp.set('views', __dirname + '/views');

        this.App = miniApp;
        this.packageName = 'project';
        this.models = App.Database[App.Config.database.default].loadModels(App.Database[App.Config.database.default].mongoose,
            __dirname + '/Models');
        this.services = App.loadServices(__dirname + '/Services',null,this);
        this.viewDirs =  __dirname + '/views';

        var that = this;
        App.Lang.add({
            directory : __dirname + '/Lang'
        });
        var Menu = new this.services.Menu();
        App.async.parallel({
            Menu : function(callback){

                Menu.get({},callback);
            }
        },function(err,results){


            miniApp.use(function(req, res, next){
                for (var a in results){
                    res.locals[a] = results[a];
                }
                res.locals.Lang = App.Lang;
                res.locals.CSRF = req.csrfToken();
                res.locals.User = req.user;
                res.locals.Helpers = App.Helpers;

                //Add all this stuff to cache so they are not loaded every time

                next();

            });
        });





        Command.registerCommand([
            App.pathName + '/bin/Command/migrate'
        ]);


    }


    return project;

});
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
        //this.services = App.loadServices(__dirname + '/Services');
        this.viewDirs =  __dirname + '/views';



    }


    return project;

});
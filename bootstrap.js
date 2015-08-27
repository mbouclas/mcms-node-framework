var Lang = require('mcms-node-localization');
var winston = require('winston');

module.exports = (function(Core,App){
    var handleExceptions = (App.Config.env == 'development') ? false : true;

    var logConfig = {
        exitOnError: false,
        transports: [
            new (winston.transports.Console)(),
            new (winston.transports.File)({ filename: App.Config.baseDir + '/logs/log.log' })
        ]
    };

    if (App.Config.env != 'development'){
        logConfig.exceptionHandlers = [
            new winston.transports.File({ filename: App.Config.baseDir + '/logs/exceptions.log' })
        ];
    }

    App.Log = new (winston.Logger)(logConfig);

    App.Lang = new Lang({
        locales : App.Config.app.locales
    });
    App.Crypt = Core.Crypt;
    App.Command = Core.Command;

    /*
     * Load databases
     */
    App.dbLoader = Core.DB;
    //App.Connections.mysql = App.dbLoader.loadConnection('mysql');
    App.Connections.mongodb = App.dbLoader.loadConnection('mongodb');
    App.Connections.elasticSearch = App.dbLoader.loadConnection('elasticSearch');
    App.Connections.redis = App.dbLoader.loadConnection('redis');



    return App;
});
module.exports = (function(App){
    //This file is for registering events only
    var wrench = require('wrench'),
        util = require('util'),
        path = require('path'),
        eventsDir = __dirname + '/Events/';

    var files = wrench.readdirSyncRecursive(eventsDir);

    files.forEach(function(file){
        if (path.extname(file) == '.js' && file.indexOf('loader') == -1){
            require(eventsDir +file)(App);

        }
    });
});
var path = require('path');
var swig = require('swig');
var wrench = require('wrench');
var lo = require('lodash');

module.exports = (function(App,server){

    App.View = {};
    App.templateEngine = swig;
    server.engine('html', swig.renderFile);
    server.set('view engine', 'html');

    server.set('view cache', App.Config.view[App.Config.view.default].cache);
// To disable Swig's cache, do the following:
    swig.setDefaults({ cache: App.Config.view[App.Config.view.default].cache });


    return {
        registerTemplates : function(targetDir,callback){
            driver = (typeof server.viewDriver == 'undefined')
                ? App.Config.view[App.Config.view.default].defaultLoadDriver
                : server.viewDriver;

            return this[driver](targetDir,callback);
        },
        loadViewsInMemory : function(targetDir,callback){
            var templates = {};
            dir.readFiles(targetDir,
                function(err, content, filename , next) {
                    if (err) throw err;

                    App.templates[filename] = content;
                    next();
                },
                function(err, files){
                    if (err) throw err;
                    swig.setDefaults({ loader: swig.loaders.memory(App.templates)});
                    //callback(templates);
                });
        },
        loadViewsFS : function(targetDir,callback){
            swig.setDefaults({ loader: swig.loaders.fs()});
        },
        registerViews : function(path,callback){

            swig.setDefaults({ loader: swig.loaders.fs(path)});
        },
        registerFilter : function(name,filter){
            swig.setFilter(name, filter);
        },
        registerFilterDir : function (dir) {
            var files = wrench.readdirSyncRecursive(dir);
            for (var a in files) {

                var file = files[a];
                var filter = require(dir + '/' + file)(App);

                this.registerFilter(filter.name, filter.func);
            }
        }
    };


});
module.exports = (function(App,server,express){
    var nunjucks = require('nunjucks');
    var path = require('path');
    var wrench = require('wrench');
    var lo = require('lodash');

    nunjucks.configure('views', {
        autoescape: true,
        express: server
    });


    return {
        engine : nunjucks,
        env : {},
        registerTemplates : function(targetDir,callback){
            driver = (typeof server.viewDriver == 'undefined')
                ? App.Config.view[App.Config.view.default].defaultLoadDriver
                : server.viewDriver;

            return this[driver](targetDir,callback);
        },
        loadViewsFS : function(targetDir,app){
            var nunjucksEnv = new nunjucks.Environment( new nunjucks.FileSystemLoader(targetDir ));
            var expressApp = (typeof app == 'undefined') ? server : app;//we can pass a custom express. Used in plugins
            this.env = nunjucksEnv;
            nunjucksEnv.express( expressApp );
        },
        registerViews : function(path,callback){

        },
        registerFilter : function(name,filter){
            if (!this.env){
                this.env = new nunjucks.Environment();
            }

            if (lo.isString(filter)){
                var file = require(filter)(App);
                filter = file.func;
            }

            this.env.addFilter(name, filter);
        },
        registerFilterDir : function (dir) {
            var files = wrench.readdirSyncRecursive(dir);
            for (var a in files) {

                var file = files[a];
                var filter = require(dir + '/' + file)(App);

                this.registerFilter(filter.name,filter.func);
            }
        }
    };
    
});
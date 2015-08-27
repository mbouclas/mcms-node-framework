var fs = require('fs'),
    path = require('path');

module.exports = (function(App,server,express){
    var viewEngine = App.Config.view[App.Config.view.default],
        driver = {};

    server.set('view engine', viewEngine);

    //Load the driver, first check if we have a native
    if (!fs.existsSync(__dirname + '/drivers/' + viewEngine.driver + '.js')){
        //no native driver found, try a require
        driver = require(viewEngine.driver)(App,server,express);
    } else {
        driver = require('./drivers/' + viewEngine.driver)(App,server,express);
    }


    driver.registerTemplates(App.Config.baseDir + App.Config.view.path);

    server.use(express.static(App.Config.baseDir + '/public'));
    return driver;
});
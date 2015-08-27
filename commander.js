var colors = require('colors');
var OS = require("os");
var path = require('path');
var environments = require('./environments');
var configLoader = require("mcms-node-config-loader").setEnv(environments);
var Config = configLoader.loadConfig(path.join(__dirname,'./App/Config'));
Config.baseDir = path.join(__dirname,'./');
Config.env = configLoader.detectedEnv;
Config.environments = environments;
var events = require('events');
var Event = new events.EventEmitter();
var App = {
    CLI : true,
    Config : Config,
    Connections : {},
    Services : {},
    Controllers : {},
    Event : Event
};
var Mcms = require("mcms-node-core")(App);

var argv = require('minimist')(process.argv.slice(2));
var Command = Mcms.Command(App);
require('./bootstrap')(Mcms,App);
App.User = Mcms.User;


//Register serviceProviders
App.serviceProviders = Mcms.serviceProvider;
App.serviceProviders.registerProvider(App.Config.app.serviceProviders);

if (typeof argv['_'][0] == 'undefined' || argv['_'][0] == null){ //show all commands
    console.log(colors.yellow('Available commands'));
    for (var a in App.commands){
        console.log(colors.green(a) + ' ::  ' + App.commands[a].description);
    }

    process.exit();
}

var command = argv['_'][0];



if (!Command.locate(command)){
    console.log(colors.red('Command not found'));
    process.exit();
}

command = App.commands[command];
command.options = argv;
command.fire(function(err,res){
    if (err){
        console.log(colors.red(err));
        process.exit();
    }

    console.log(res);
    process.exit();
});








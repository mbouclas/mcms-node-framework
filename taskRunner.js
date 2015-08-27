var colors = require('colors');
var OS = require("os");
var path = require('path');
var fs = require('fs');
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
App.Mail = Mcms.Mail(App.Config.mail[App.Config.mail.default]);

//Register serviceProviders
App.serviceProviders = Mcms.serviceProvider;
App.serviceProviders.registerProvider(App.Config.app.serviceProviders);

var dir = App.Config.baseDir + 'App/' + App.Config.view.path + '/';
var nunjucks = require('nunjucks');
App.View = new nunjucks.Environment( new nunjucks.FileSystemLoader(dir ));



//fire up runner
var Worker = Mcms.Worker,
    TaskRunner = new Worker();
TaskRunner.init();
/*var sampleJob = require('./tests/sampleJob.json');
var worker = require('./workers/notifyCustomer')(App);
worker(12,sampleJob.payload,function(err,success){
    console.log('Error: ',err);
    console.log(success);



});*/


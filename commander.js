require('rootpath')();
var colors = require('colors');
var App = {
    pathName : __dirname,
    CLI : true
};

var argv = require('minimist')(process.argv.slice(2));
var Command = require('mcms-node-core/lib/Framework/Command/loader')(App);
require('./Bootstrap/start');
var Mcms = require('mcms-node-core')(App);


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








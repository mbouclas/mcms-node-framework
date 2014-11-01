var App = {
    pathName : __dirname
};
require('./Bootstrap/start');
var Mcms = require('mcms-node')(App);
//require('./App/routes')(Mcms);

module.exports = Mcms;
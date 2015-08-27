module.exports = (function (App, Route, Package) {
  var express = require('express');
  var router = express.Router();
  var Controllers = App.Controllers[Package.packageName];


  var names = {
    UserCP: '/'
  };

  Route.set(names, 'userCP');

  return router;

});
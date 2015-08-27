module.exports = (function (App, Route, Package) {
  var express = require('express');
  var router = express.Router();
  var Controllers = App.Controllers[Package.packageName];


  var names = {
    SignUp: '/signup',
    Activate: '/activate/:token',
    ForgotPassword : '/forgotPassword/:token',
    ResetPassword : '/resetPassword/:token'
  };

  Route.set(names, 'user');


  router.get('/signup', [], Controllers['User/User'].signUp);
  router.get('/activate/:token', [], Controllers['User/User'].activateUser);
  router.get('/resetPassword/:token', [], Controllers['User/User'].resetPasswordUI);



  return router;

});
module.exports = (function(Config,Event){
  var App = {
    Config : Config,
    Connections : {},
    Services : {},
    Controllers : {},
    Event : Event,
    Cache : {},
    CacheMan : {},
    Lang:  {},
    Benchmark : {
      start : 0,
      hrstart : 0,
      init : function(){
        this.start = new Date();
        this.hrstart = process.hrtime();
      },
      end : function(msg){
        var end = new Date() - this.start,
            hrend = process.hrtime(this.hrstart);

        console.info("Execution time for "+ msg +": %dms", end);
        console.info("Execution time (hr) for "+ msg +": %ds %dms", hrend[0], hrend[1]/1000000);
        console.log('--------------------------');
      }
    }
  };
  var Core = require("mcms-node-core")(App);
  var compression = require('compression');
  var express = require('express');
  var path = require('path');
  var favicon = require('serve-favicon');
  var logger = require('morgan');
  var cookieParser = require('cookie-parser');
  var bodyParser = require('body-parser');
  var session = require('express-session');
  var flash = require('connect-flash');
  var app = express();
  var fs = require('fs');
  var Qs = require('express-qs-manager');
  var multer = require('multer');
  var lo = require('lodash');
  App.CacheMan = Core.Cache;
  require('./bootstrap')(Core,App);
  App.server = app;
  App.express = express;
  var pmx = require('pmx');
  App.pmx = pmx;
  // view engine setup
  App.viewEngine = require('./App/View/engine')(App,app,express);


  // uncomment after placing your favicon in /public
  //app.use(favicon(__dirname + '/public/favicon.ico'));
  app.set('views', __dirname + '/App/views');
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(multer({ dest: path.join(App.Config.baseDir,App.Config.app.uploads.dest),
    rename: function (fieldname, filename) {
      return filename.replace(/\W+/g, '-').toLowerCase() + Date.now();
    },
    onFileUploadStart: function (file) {
      App.Event.emit('file.upload.started',file);
    },
    onFileUploadComplete: function (file) {
      App.Event.emit('file.upload.complete',file);
    },
    onError: function (error, next) {
      App.Event.emit('file.upload.error',error);
      next(error)
    }
  }));
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(compression());

  App.Session = Core.Session.init();

  //require('non-csrf-routes');


  app.use(function (err, req, res, next) {
    if (err.code !== 'EBADCSRFTOKEN') return next(err);

    // handle CSRF token errors here
    res.status(403);
    res.send('session has expired or form tampered with');
  });

  App.User = Core.User;
  App.Route = require('mcms-node-named-routes');
  app.use(Qs.init());
  App.Queue = Core.Queue(App.Config.queue[App.Config.queue.default]);
  App.Mail = Core.Mail(App.Config.mail[App.Config.mail.default]);
  app.use(require('express-domain-middleware'));
  //Register serviceProviders
  App.serviceProviders = Core.serviceProvider;
  App.serviceProviders.registerProvider(App.Config.app.serviceProviders);
  require("./routes")(App,app);//All our routes
  var csrf = require('csurf');
  app.use(csrf());
  app.use(function(req, res, next){
    if (req.csrfToken){
      res.locals.CSRF = req.csrfToken();
    }

    next();
  });
  app.use(pmx.expressErrorHandler());

  // catch 404 and forward to error handler
  app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });



  // development error handler
  // will print stacktrace
  app.use(function(err, req, res, next) {
    err.status = err.status || 500;
    if (Config.env == 'development'){
      console.log(err.stack);
    }
    var error = (lo.isObject(err)) ? JSON.stringify(err) : err;
    if (err.status && err.status == 404) {
      App.Log.error(req.url + ' Not Found');
    }

    if (err.status && err.status != 404) {
      App.Log.error({
        url: req.url,
        message: err.message,
        error : error
      });

      pmx.notify({
        url: req.url,
        message: err.message,
        error : error
      });
    }

    res.status(err.status);

    res.render('Errors/' + err.status || 500 + '.html', {
      url: req.url,
      message: err.message,
      error: err
    });
  });


/*
  app.use(function(err, req, res, next) {
    App.Log.error({
      url: req.url,
      message: err.message,
      error: err
    });
    res.status(err.status || 500);
    res.render('error.html', {
      message: err.message,
      error: {}
    });
  });
*/

  process.on('uncaughtException', function (exception) {
    console.log('New exception : ',exception);

    App.Log.error(exception);
    pmx.notify({
      exception : JSON.stringify(exception)
    });
    process.exit();
  });

  //Add everything that needs to run after Express is fully loaded.
  App.Event.on('app.started',function(){
    require('./App/events')(App);
    console.log('ok, we are go!');
  });

  var memwatch = require('memwatch-next');
  memwatch.on('leak', function(info) {
    App.Log.error('Memory leak :',info);

    pmx.notify({
      memoryLeak : JSON.stringify(info)
    });
  });

  return app;
});
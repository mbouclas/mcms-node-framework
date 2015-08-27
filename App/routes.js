module.exports = (function(App,Express,Package){

    var Route = App.Route;
    var names = {
        SiteHome : '/'
    };

    Route.set(names);
    Express.use(Route.use);
    //Express.use(Cart);
    Express.use('/',App.Auth.middleware.applyCSRF,require('./routes/index')(App,Route,Package));

});

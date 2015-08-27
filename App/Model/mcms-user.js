module.exports = (function(App){
    var defaultDB = App.Config.database.default;

    //check if model is loaded
/*    if (typeof App.Connections[defaultDB].Model.User == 'undefined'){
        //problem... model not loaded for some reason, throw an exception
        throw ("User model not loaded");
    }*/

    var defaultConnection = App.Connections[defaultDB];


    //load all the user services from the default location
    return App.User(App,defaultDB,defaultConnection);
});
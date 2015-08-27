module.exports = (function(App){
    App.Event.on('cache.reset.object',function(tag,key,object){
        //for example Cache[pages][permalink]
        App.CacheMan.remove(tag,key);
    });

    App.Event.on('cache.reset.all',function(tag){
        //for example Cache[pages]
        App.CacheMan.flush(tag);
    });
});
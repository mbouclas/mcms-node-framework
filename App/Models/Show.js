module.exports = function (mongoose, modelName) {

    // Define your mongoose model as usual...
    var schema = mongoose.Schema({
        title: String,
        year : Number,
        url : String,
        first_aired : Number,
        country : String,
        overview : String,
        runtime : Number,
        status : String,
        network : String,
        air_day : String,
        air_time : String,
        imdb_id : String,
        tvdb_id : Number,
        tvrage_id : Number,
        images : {},
        watcher : Number,
        ratings : {}
    });
    // `modelName` in here will be "Show"
    mongoose.model(modelName, schema);
};
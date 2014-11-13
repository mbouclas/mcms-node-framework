module.exports = function (mongoose, modelName) {

    // Define your mongoose model as usual...
    var schema = mongoose.Schema({
        title: String,
        permalink: String,
        alias: String,//how we call it in templates
        orderby: Number,
        created_at: Date,
        updated_at: Date,
        items : [],
        settings : {}
    });


    mongoose.model(modelName, schema);
};
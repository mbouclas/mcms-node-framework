module.exports = function (mongoose, modelName) {

    // Define your mongoose model as usual...
    var schema = mongoose.Schema({
        category: { type: [String], index: true },
        description: String,
        permalink: String,
        orderby: Number,
        created_at: Date,
        updated_at: Date,
        settings : {}
    });

    // `modelName` in here will be "User"
    mongoose.model(modelName, schema);
};
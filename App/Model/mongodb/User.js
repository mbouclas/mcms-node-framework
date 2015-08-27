module.exports = function (mongoose, modelName) {
    // Define your mongoose model as usual...
    var schema = mongoose.Schema({
        username: { type: String, index: true },
        password: String,
        email: { type: String, index: true },
        firstName: String,
        lastName: String,
        active: Number,
        activated_at: {type : Date, default : Date.now},
        created_at: {type : Date, default : Date.now},
        updated_at: {type : Date, default : Date.now},
        remember_token : String,
        activation_code : String,
        userClass : String,
        permissions : {},
        preferences : {},
        settings : {},
        oldID : Number
    }, { strict: false });
    // `modelName` in here will be "User"
    mongoose.model(modelName, schema);
};
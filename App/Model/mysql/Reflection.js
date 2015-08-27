module.exports = function(sequelize, DataTypes) {
    return sequelize.define("Reflection", {
        messageId : DataTypes.STRING,
        type : DataTypes.STRING,
        value : DataTypes.STRING

    },{
        timestamps : false,
        freezeTableName: true,
        tableName : 'message_reflections'
    });
};
module.exports = function(sequelize, DataTypes) {
    return sequelize.define("Brand", {
        id: {
            type : DataTypes.INTEGER,
            primaryKey: true
        },
        key: DataTypes.STRING,
        name: DataTypes.STRING,
        description: DataTypes.TEXT,
        settings: DataTypes.TEXT
    },{
        timestamps : false,
        freezeTableName: true,
        tableName : 'brands'
    });
};
module.exports = function(sequelize, DataTypes) {
    return sequelize.define("User", {
        uname: DataTypes.STRING,
        email: DataTypes.STRING,
        first_name: DataTypes.STRING,
        last_name: DataTypes.STRING,
        key: DataTypes.STRING,
        settings: {
            type : DataTypes.STRING,
            get  : function()  {
                return JSON.parse(this.getDataValue('settings'));
            },
            set : function(val) {
                this.setDataValue('settings', JSON.stringify(val));
            }
        },
        prefs: {
            type : DataTypes.STRING,
            get  : function()  {
                return JSON.parse(this.getDataValue('settings'));
            },
            set : function(val) {
                this.setDataValue('settings', JSON.stringify(val));
            }
        }

    },{
        timestamps : false,
        freezeTableName: true,
        tableName : 'users'
    });
};
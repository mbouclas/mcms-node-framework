module.exports = function(sequelize, DataTypes) {
    return sequelize.define("Inbox", {
        user_id: DataTypes.INTEGER,
        user_key: DataTypes.STRING,
        messageId: DataTypes.STRING,
        from_name: DataTypes.STRING,
        from_addr: DataTypes.STRING,
        received_alias: DataTypes.STRING,
        received_email: DataTypes.STRING,
        subject: DataTypes.STRING,
        parsed_body: DataTypes.TEXT,
        html_body: DataTypes.TEXT,
        headers: DataTypes.TEXT,
        reflection: DataTypes.STRING,
        archived: DataTypes.INTEGER,
        received_datetime: DataTypes.INTEGER,
        read: DataTypes.INTEGER
    },{
        timestamps : false,
        freezeTableName: true,
        tableName : 'users_inbox'
    });
};
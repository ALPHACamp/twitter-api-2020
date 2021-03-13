'use strict'
module.exports = (sequelize, DataTypes) => {
    const ChatPrivate = sequelize.define('ChatPrivate', {
        UserId: DataTypes.INTEGER,
        channelId: DataTypes.STRING,
        message: DataTypes.TEXT
    }, {})
    ChatPrivate.associate = function (models) {
        ChatPrivate.belongsTo(models.User)
    }
    return ChatPrivate
}
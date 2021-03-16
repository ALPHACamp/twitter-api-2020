'use strict'
module.exports = (sequelize, DataTypes) => {
    const Chat = sequelize.define('Chat', {
        UserId: DataTypes.INTEGER,
        channel: DataTypes.STRING,
        message: DataTypes.TEXT,
        avatar: DataTypes.STRING,

    }, {})
    Chat.associate = function (models) {
        Chat.belongsTo(models.User)
        Chat.hasMany(models.ChatRead)
    }
    return Chat
}
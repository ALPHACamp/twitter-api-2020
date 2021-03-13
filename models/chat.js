'use strict'
module.exports = (sequelize, DataTypes) => {
    const Chat = sequelize.define('Chat', {
        UserId: DataTypes.INTEGER,
        channel: DataTypes.STRING,
        message: DataTypes.TEXT
    }, {})
    Chat.associate = function (models) {
        Chat.belongsTo(models.User)
    }
    return Chat
}
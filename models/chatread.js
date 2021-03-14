module.exports = (sequelize, DataTypes) => {
    const ChatRead = sequelize.define('ChatRead', {
        UserId: DataTypes.INTEGER,
        ChatID: DataTypes.INTEGER,

    }, {})
    ChatRead.associate = function (models) {
        ChatRead.belongsTo(models.Chat)
    }
    return ChatRead
}
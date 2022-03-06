'use strict'
module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define('Message', {
    UserId: DataTypes.INTEGER,
    content: DataTypes.STRING,
    roomId: DataTypes.STRING,
    receiverId: DataTypes.INTEGER
  }, {
    tableName: 'Messages',
  })
  Message.associate = function (models) {
    Message.belongsTo(models.User)
  }
  return Message
}
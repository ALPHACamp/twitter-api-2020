'use strict'
module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define(
    'Message',
    {
      content: DataTypes.TEXT,
      GiverId: DataTypes.INTEGER,
      ReceiverId: DataTypes.INTEGER
    },
    {}
  )
  Message.associate = function (models) {
    // associations can be defined here
    Message.belongsTo(models.User)
  }
  return Message
}

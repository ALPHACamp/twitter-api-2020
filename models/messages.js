'use strict'
module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define('Message', {
    UserId: DataTypes.INTEGER,
    msg: DataTypes.TEXT
  }, {})
  Message.associate = function (models) {
    // associations can be defined here
  }
  return Message
}
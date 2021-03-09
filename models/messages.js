'use strict'
module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define('Message', {
    UserId: DataTypes.INTEGER,
    msg: DataTypes.TEXT,
    time: DataTypes.STRING
  }, {})
  Message.associate = function (models) {
    // associations can be defined here
  }
  return Message
}
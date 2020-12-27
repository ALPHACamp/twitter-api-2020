'use strict';
module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define('Message', {
    sender: DataTypes.STRING,
    message: DataTypes.STRING,
    targetChannel: DataTypes.STRING
  }, {});
  Message.associate = function (models) {
    // associations can be defined here
  };
  return Message;
};
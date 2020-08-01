'use strict';
module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define('Message', {
    userId: DataTypes.INTEGER,
    content: DataTypes.TEXT
  }, {});
  Message.associate = function(models) {
    // associations can be defined here
  };
  return Message;
};
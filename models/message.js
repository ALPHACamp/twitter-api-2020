'use strict';
module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define('Message', {
    UserId: {
      type: DataTypes.INTEGER
    },
    content: {
      type: DataTypes.STRING
    }
  }, {});
  Message.associate = function (models) {
    Message.belongsTo(models.User)
  };
  return Message;
};
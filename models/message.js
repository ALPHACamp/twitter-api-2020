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
    Message.belongsTo(models.User, {
      foreignKey: 'senderId',
      as: 'Sender'
    })
    Message.belongsTo(models.User, {
      foreignKey: 'receiverId',
      as: 'Receiver'
    })
  };
  return Message;
};
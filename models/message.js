'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Message extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Message.belongsTo(models.Room)
      Message.belongsTo(models.User, {
        as: 'Senders',
        foreignKey: 'senderId'
      })
      Message.belongsTo(models.User, {
        as: 'Receivers',
        foreignKey: 'receiverId'
      })
    }
  };
  Message.init({
    content: DataTypes.TEXT,
    RoomId: DataTypes.INTEGER,
    receiverId: DataTypes.INTEGER,
    senderId: DataTypes.INTEGER,
    isRead: DataTypes.BOOLEAN,
  }, {
    sequelize,
    modelName: 'Message',
  });
  return Message;
};
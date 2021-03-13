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
      Message.belongsTo(models.User, { as: 'from' })
      Message.belongsTo(models.User, { as: 'to' })
    }
  };
  Message.init({
    fromId: DataTypes.INTEGER,
    toId: DataTypes.INTEGER,
    content: DataTypes.TEXT,
    sendTime: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Message',
  });
  return Message;
};
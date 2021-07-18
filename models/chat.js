'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Chat extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      Chat.belongsTo(models.User)
      Chat.belongsTo(models.Room)
    }
  };
  Chat.init({
    UserId: DataTypes.INTEGER,
    text: DataTypes.STRING,
    RoomId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Chat'
  })
  return Chat
}

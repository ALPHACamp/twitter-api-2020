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
    }
  };
  Chat.init({
    UserId: DataTypes.INTEGER,
    text: DataTypes.STRING,
    room: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Chat'
  })
  return Chat
}

'use strict';
const {
  Model
} = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class Like extends Model {
    static associate(models) {
      Like.belongsTo(models.User, { foreignKey: 'userId' })
      Like.belongsTo(models.Tweet, { foreignKey: 'tweetId' })
    }
  };
  Like.init({
    userId: DataTypes.INTEGER,
    tweetId: DataTypes.INTEGER 
  }, {
    sequelize,
    modelName: 'Like',
    tableName: 'Likes',
    underscored: true
  })
  return Like
}

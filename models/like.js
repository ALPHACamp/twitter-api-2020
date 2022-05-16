'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Like extends Model {
    static associate (models) {
      Like.belongsTo(models.User, { foreignKey: 'UserId' })
      Like.belongsTo(models.Tweet, { foreignKey: 'TweetId' })
    }
  };
  Like.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    UserId: DataTypes.INTEGER,
    TweetId: DataTypes.INTEGER,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Like',
    tableName: 'Likes',
    underscored: true
  })
  return Like
}

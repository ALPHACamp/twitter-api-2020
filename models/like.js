'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Like extends Model {
    static associate (models) {
      // 和Tweet的關聯
      Like.belongsTo(models.Tweet, { foreignKey: 'TweetId' })
      // 和User的關聯
      Like.belongsTo(models.User, { foreignKey: 'UserId' })
    }
  };
  Like.init({
    UserId: DataTypes.INTEGER,
    TweetId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Like',
    tableName: 'Likes',
    underscored: true
  })
  return Like
}

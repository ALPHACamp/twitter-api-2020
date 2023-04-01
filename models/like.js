'use strict'
const {
  Model
} = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class Like extends Model {
    static associate (models) {
      Like.belongsTo(models.User, { foreignKey: 'UserId' })
      Like.belongsTo(models.Tweet, { foreignKey: 'TweetId' })
      Like.belongsTo(models.Reply, { foreignKey: 'ReplyId' })
    }
  }
  Like.init({
    UserId: DataTypes.INTEGER,
    TweetId: DataTypes.INTEGER,
    ReplyId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Like',
    tableName: 'Likes',
    underscored: true
  })
  return Like
}

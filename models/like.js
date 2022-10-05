'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Like extends Model {
    static associate (models) {
      Like.belongsTo(models.User, { foreignKey: 'userId' })
      Like.belongsTo(models.Tweet, { foreignKey: 'tweetId' })
    }
  };
  Like.init({
    isLiked: DataTypes.BOOLEAN,
    UserId: DataTypes.INTEGER,
    TweetId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Like',
    tableName: 'Likes',
    underscored: true
  })
  // const Like = sequelize.define('Like', {
  // }, {})
  // Like.associate = function (models) {
  // }
  // return Like
  return Like
}

'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Tweet extends Model {
    static associate(models) {
      Tweet.hasMany(models.Reply, { foreignKey: 'TweetId', as: 'replied' })
      Tweet.hasMany(models.Like, { foreignKey: 'TweetId', as: 'liked' })
      Tweet.belongsTo(models.User, { foreignKey: 'UserId' })
    }
  };
  Tweet.init({
    UserId: DataTypes.INTEGER,
    description: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Tweet',
    tableName: 'Tweets'
  })
  return Tweet
}
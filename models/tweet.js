'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class Tweet extends Model {
    static associate (models) {
      Tweet.belongsTo(models.User, {
        foreignKey: 'UserId',
        as: 'TweetUser'
      })
      Tweet.hasMany(models.Reply, {
        foreignKey: 'TweetId',
        as: 'TweetReply'
      })
      Tweet.hasMany(models.Like, {
        foreignKey: 'TweetId',
        as: 'TweetLike'
      })
    }
  }
  Tweet.init(
    {
      UserId: DataTypes.INTEGER,
      description: DataTypes.TEXT,
      likedCount: DataTypes.INTEGER
    },
    {
      sequelize,
      modelName: 'Tweet',
      tableName: 'Tweets'
    }
  )
  return Tweet
}

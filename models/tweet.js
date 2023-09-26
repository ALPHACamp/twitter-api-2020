'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Tweet extends Model {}
  Tweet.init({
    UserId: DataTypes.INTEGER,
    description: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Tweet',
    tableName: 'Tweets'
  })

  Tweet.associate = function (models) {
    Tweet.belongsTo(models.User, {
      foreignKey: 'UserId'
    })
    Tweet.hasMany(models.Reply, {
      foreignKey: 'TweetId'
    })
    Tweet.hasMany(models.Like, {
      foreignKey: 'TweetId'
    })
  }
  return Tweet
}

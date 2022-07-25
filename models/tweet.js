'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Tweet extends Model {
    static associate(models) {
      Tweet.hasMany(models.Like, { foreignKey: 'tweetId' })
      Tweet.hasMany(models.Reply, { foreignKey: 'tweetId' })
      Tweet.belongsTo(models.User, { foreignKey: 'userId' })
    }
  }
  Tweet.init({
    description: DataTypes.TEXT,
    user_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Tweet',
    tableName: 'Tweets', // 別忘了這行
    underscored: true
  })
  return Tweet;
}
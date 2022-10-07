'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Tweet extends Model {
    static associate (models) {
      Tweet.hasMany(models.Reply, { foreignKey: 'TweetId' })
      Tweet.hasMany(models.Like, { foreignKey: 'TweetId' })
      Tweet.belongsTo(models.User, { foreignKey: 'UserId' })
    }
  }
  Tweet.init({
    description: DataTypes.TEXT(140),
    UserId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Tweet',
    tableName: 'Tweets',
    paranoid: false,
    underscored: true
  })
  return Tweet
}

'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Tweet extends Model {
    static associate (models) {
      Tweet.belongsTo(models.User, { foreignKey: 'UserId' })
      Tweet.hasMany(models.Like, {
        foreignKey: 'TweetId'
      })
      Tweet.hasMany(models.Reply, {
        foreignKey: 'TweetId'
      })
    }
  };
  Tweet.init({
    description: DataTypes.TEXT,
    UserId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Tweet',
    tableName: 'Tweets',
    underscored: true
  })
  return Tweet
}

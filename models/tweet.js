'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Tweet extends Model {
    static associate(models) {
      // define association here
      Tweet.belongsTo(models.User, { foreignKey: "userId" })
      Tweet.hasMany(models.Reply, { foreignKey: "tweetId" })
      Tweet.hasMany(models.Like, {
        foreignKey: 'tweetId'
      })
      Tweet.belongsToMany(models.User,{
        through: models.Like,
        foreignKey: 'TweetId',
        as: 'LikedUsers'
      })
    }
  };
  Tweet.init({
    userId: DataTypes.INTEGER,
    description: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Tweet',
    tableName: 'Tweets',
    underscored: true
  })
  return Tweet
}
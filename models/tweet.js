'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Tweet extends Model {
    static associate(models) {
      // define association here
      Tweet.hasMany(models.Reply)
    // Tweet.hasMany(models.Like)
    // Tweet.belongTo(models.User)
    // Tweet.belongsToMany(models.User, {
    //   through: models.Like,
    //   foreignKey: 'TweetId',
    //   as: 'LikedUsers'
    // })
    }
  };
  Tweet.init({
    UserId: DataTypes.INTEGER,
    description: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Tweet',
    tableName: 'Tweets',
    underscored: true
  })
  return Tweet
}
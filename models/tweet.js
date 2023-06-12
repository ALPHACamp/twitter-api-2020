'use strict';

const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Tweet extends Model {
    
    static associate(models) {
      Tweet.belongsTo(models.User, { foreignKey: 'UserId' })
      Tweet.hasMany(models.Like, { foreignKey: 'TweetId' })
      Tweet.hasMany(models.Reply, { foreignKey: 'TweetId' })
      // Tweet.belongsToMany(models.User, {
      //   through: models.Like, 
      //   foreignKey: 'tweetId', 
      //   as: 'LikedUsers' 
      // })
    }
  };
  Tweet.init({
    description: DataTypes.TEXT,
    numberLike: DataTypes.INTEGER,
    numberUnlike: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Tweet',
    tableName: 'Tweets'
  })
  return Tweet
}

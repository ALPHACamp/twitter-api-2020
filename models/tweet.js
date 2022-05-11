'use strict';
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Tweet extends Model {
    static associate(models) {
      Tweet.belongsTo(models.User, { foreignKey: 'userId' })
      Tweet.hasMany(models.Reply, { foreignKey: 'tweetId' })
      Tweet.belongsToMany(models.User, {
        through: models.Like,
        as: 'LikedUsers',
        foreignKey: 'tweetId'
      })
      Tweet.hasMany(models.Like, { foreignKey: 'tweetId' })
    }
  };
  Tweet.init({
    description: DataTypes.TEXT,
    userId: DataTypes.INTEGER,
    replyCount: DataTypes.INTEGER,
    likeCount: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Tweet',
    tableName: 'Tweets',
    underscored: true
  })
  return Tweet
}

'use strict';

const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Tweet extends Model {
    
    static associate(models) {
      Tweet.belongsTo(models.User, { foreignKey: 'UserId' })
      Tweet.hasMany(models.Like, { foreignKey: 'tweetId' })
      Tweet.hasMany(models.Reply, { foreignKey: 'tweetId' })
    }
  };
  Tweet.init({
    userId: DataTypes.INTEGER,
    description: DataTypes.TEXT,
    numberLike: DataTypes.INTEGER,
    numberUnlike: DataTypes.INTEGER,
    underscored: true
  }, {
    sequelize,
    modelName: 'Tweet',
    tableName: 'Tweets'
  })
  return Tweet
}

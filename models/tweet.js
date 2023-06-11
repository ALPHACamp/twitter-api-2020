'use strict';

const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Tweet extends Model {
    
    static associate(models) {
      Tweet.belongsTo(models.User, { foreignKey: 'userId' })
      Tweet.hasMany(models.Like, { foreignKey: 'tweetId' })
      Tweet.hasMany(models.Reply, { foreignKey: 'tweetId' })
      Tweet.belongsToMany(models.User, {
        through: models.Like, 
        foreignKey: 'tweetId', 
        as: 'LikedUsers' 
      })
    }
  };
  Tweet.init({
    description: DataTypes.TEXT,
    numberLike: DataTypes.INTEGER,
    numberUnlike: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Tweet',
    tableName: 'Tweets',
    underscored: true
  })
  return Tweet
}

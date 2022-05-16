'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Tweet extends Model {
    static associate (models) {
      Tweet.belongsTo(models.User, { foreignKey: 'UserId' })
      Tweet.hasMany(models.Reply, { foreignKey: 'TweetId' })
      Tweet.hasMany(models.Like, { foreignKey: 'TweetId' })
      Tweet.belongsToMany(models.User, {
        through: models.Like,
        foreignKey: 'TweetId',
        as: 'LikedUsers'
      })
    }
  };
  Tweet.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    UserId: DataTypes.INTEGER,
    description: DataTypes.TEXT,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Tweet',
    tableName: 'Tweets',
    underscored: true
  })
  return Tweet
}

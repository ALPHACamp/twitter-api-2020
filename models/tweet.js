'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Tweet extends Model {
    static associate(models) {
      Tweet.hasMany(models.Reply, { foreignKey: 'TweetId' })
      Tweet.hasMany(models.Like, { foreignKey: 'TweetId' })
      Tweet.belongsTo(models.User, { foreignKey: 'UserId' })
      Tweet.belongsToMany(models.User, {
        through: models.Like,
        foreignKey: 'TweetId',
        as: 'LikedUsers',
      })
    }
  };
  Tweet.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    UserId: DataTypes.INTEGER,
    description: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Tweet',
    tableName: 'Tweets'
  })
  return Tweet
}
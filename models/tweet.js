'use strict'

const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class Tweet extends Model {
    static associate (models) {
      Tweet.hasMany(models.Reply, {
        foreignKey: 'TweetId',
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      })
      Tweet.hasMany(models.Like, {
        foreignKey: 'TweetId',
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      })
      Tweet.belongsTo(models.User, { foreignKey: 'UserId' })
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

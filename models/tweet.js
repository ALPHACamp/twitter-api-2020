'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Tweet extends Model {
    static associate (models) {
      // Relation(s)
      Tweet.hasMany(models.Like, {
        foreignKey: 'TweetId',
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      })
      Tweet.hasMany(models.Reply, {
        foreignKey: 'TweetId',
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      })
      Tweet.belongsTo(models.User, { foreignKey: 'UserId' })
    }
  }
  Tweet.init({
    // field: DataTypes.TYPE
    description: DataTypes.TEXT,
    UserId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Tweet',
    tableName: 'Tweets'
  })
  return Tweet
}

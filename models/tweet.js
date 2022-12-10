'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Tweet extends Model {
    static associate (models) {
      // Relation(s)
      Tweet.hasMany(models.Like, { foreignKey: 'tweetId' })
      Tweet.hasMany(models.Reply, { foreignKey: 'tweetId' })
      Tweet.belongsTo(models.User, { foreignKey: 'userId' })
    }
  }
  Tweet.init({
    // field: DataTypes.TYPE
    description: DataTypes.TEXT,
    userId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Tweet',
    tableName: 'Tweets'
  })
  return Tweet
}

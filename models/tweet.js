'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Tweet extends Model {
    static associate (models) {
      // 和Like的關聯
      Tweet.hasMany(models.Like, { foreignKey: 'TweetId' })
      // 和Reply的關聯
      Tweet.hasMany(models.Reply, { foreignKey: 'TweetId' })
      // 和User的關聯
      Tweet.belongsTo(models.User, {
        foreignKey: 'UserId'
      })
    }
  }
  Tweet.init({
    description: DataTypes.TEXT,
    UserId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Tweet',
    tableName: 'Tweets',
    underscored: true
  })
  return Tweet
}

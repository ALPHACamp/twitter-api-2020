'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Tweet extends Model {
    static associate (models) {
      Tweet.belongsTo(models.User, { foreignKey: 'UserId' })
      Tweet.hasMany(models.Reply, { foreignKey: 'TweetId', onDelete: 'CASCADE' })
      Tweet.hasMany(models.Like, { foreignKey: 'TweetId', onDelete: 'CASCADE' })
      Tweet.belongsToMany(models.User, {
        through: models.Like,
        foreignKey: 'TweetId',
        as: 'LikedUsers'
      })
    }
  }
  Tweet.init({
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    UserId: DataTypes.INTEGER,
    description: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Tweet',
    tableName: 'Tweets'
  })
  return Tweet
}

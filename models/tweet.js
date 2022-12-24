'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Tweet extends Model {
    static associate(models) {
      Tweet.hasMany(models.Like, {
        foreignKey: 'TweetId',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      })
      Tweet.hasMany(models.Reply, {
        foreignKey: 'TweetId',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      })
      Tweet.belongsTo(models.User, { foreignKey: 'UserId' })
    }
  }
  Tweet.init({
    // Model attributes are defined here
    UserId: DataTypes.INTEGER,
    description: DataTypes.TEXT
  }, {
    // Other model options go here
    sequelize, // We need to pass the connection instance
    modelName: 'Tweet', // We need to choose the model name
    tableName: 'Tweets',
    underscored: true
  })
  return Tweet
}

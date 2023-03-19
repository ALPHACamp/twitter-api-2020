'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Tweet extends Model {
    static associate(models) {
      // define association here
      Tweet.belongsTo(models.User, { foreignKey: 'UserId' })
      Tweet.hasMany(models.Reply, { foreignKey: 'TweetId' })
      Tweet.belongsToMany(models.User, {
        through: models.Like, // 透過 Like 表來建立關聯
        foreignKey: 'TweetId', // 對 Like 表設定 FK
        as: 'LikedUsers' // 幫這個關聯取個名稱
      })
    }
  }

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
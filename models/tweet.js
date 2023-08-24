'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Tweet extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      // define association here
      Tweet.hasMany(models.Reply, { foreignKey: 'tweetId', as: 'replies' })
      Tweet.hasMany(models.Like, { foreignKey: 'tweetId' })
      Tweet.belongsTo(models.User, { foreignKey: 'userId', as: 'author' })
    }
  }
  Tweet.init(
    {
      description: DataTypes.TEXT,
      UserId: DataTypes.INTEGER,
      likeCount: DataTypes.INTEGER,
      replyCount: DataTypes.INTEGER
    },
    {
      sequelize,
      modelName: 'Tweet',
      tableName: 'Tweets',
      underscored: true
    }
  )
  return Tweet
}

'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Tweet extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      Tweet.belongsTo(models.User)
      
      Tweet.belongsToMany(models.User, {
        through: models.Like,
        foreignKey: 'TweetId',
        as: 'LikeUser'
      })

      Tweet.belongsToMany(models.User, {
        through: models.Reply,
        foreignKey: 'TweetId',
        as: 'ReplyUser'
      })
    }
  };
  Tweet.init({
    UserId: DataTypes.INTEGER,
    description: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Tweet'
  })
  return Tweet
}
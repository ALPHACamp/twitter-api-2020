'use strict'
module.exports = (sequelize, DataTypes) => {
  const Tweet = sequelize.define('Tweet', {
  }, {})
  Tweet.associate = function (models) {
    Tweet.hasMany(models.Reply, { foreignKey: 'TweetId' })
    Tweet.belongsTo(models.User, { foreignKey: 'UserId' })
    Tweet.hasMany(models.Like, { foreignKey: 'TweetId' })
    Tweet.belongsToMany(models.User, {
      through: models.Like,
      foreignKey: 'TweetId',
      as: 'LikedUsers'
    })
  }
  Tweet.init({
    description: DataTypes.TEXT,
    UserId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Tweet',
    tableName: 'Tweets'
  })
  return Tweet
}

'use strict'
module.exports = (sequelize, DataTypes) => {
  const Tweet = sequelize.define('Tweet', {
    description: DataTypes.TEXT(140)
  }, {
    modelName: 'Tweet',
    tableName: 'Tweets',
    underscored: true
  })
  Tweet.associate = function (models) {
    Tweet.hasMany(models.Reply, { foreignKey: 'tweetId' })
    Tweet.hasMany(models.Like, { foreignKey: 'tweetId' })
    Tweet.belongsTo(models.User, { foreignKey: 'userId' })
  }
  return Tweet
}

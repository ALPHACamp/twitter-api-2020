'use strict'
module.exports = (sequelize, DataTypes) => {
  const Tweet = sequelize.define('Tweet', {
  }, {})
  Tweet.associate = function (models) {
    Tweet.belongsTo(models.User, { foreignKey: 'UserId' })
    Tweet.hasMany(models.Rely, { foreignKey: 'TweetId' })
    Tweet.hasMany(models.Like, { foreignKey: 'TweetId' })
  }
  Tweet.init({
    UserId: DataTypes.INTEGER,
    email: DataTypes.STRING,
    description: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Tweet',
    tableName: 'Tweets',
    underscored: true
  })
  return Tweet
}

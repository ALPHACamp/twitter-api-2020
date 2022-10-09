'use strict'
module.exports = (sequelize, DataTypes) => {
  const Tweet = sequelize.define('Tweet', {
  }, {});
  Tweet.associate = function(models) {
    Tweet.hasMany(models.Like, {foreignKey: 'TweetId'})
    Tweet.hasMany(models.Reply, {foreignKey: 'TweetId'})
    Tweet.belongsTo(models.User, {
      foreignKey: 'UserId',
      as: 'tweetAuthor'})
  };

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

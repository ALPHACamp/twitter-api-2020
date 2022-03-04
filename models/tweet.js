'use strict';
module.exports = (sequelize, DataTypes) => {
  const Tweet = sequelize.define('Tweet', {
    UserId: DataTypes.INTEGER,
    description: DataTypes.TEXT,
    likedCount: DataTypes.INTEGER,
    repliedCount: DataTypes.INTEGER
  }, {
    tableName: 'Tweets',
  });
  Tweet.associate = function (models) {
    Tweet.belongsTo(models.User, { foreignKey: 'UserId' })
    Tweet.hasMany(models.Reply, { foreignKey: 'TweetId' })
    Tweet.hasMany(models.Like, { foreignKey: 'TweetId' })
    Tweet.hasMany(models.Notification, { foreignKey: 'TweetId' })
  };
  return Tweet;
};
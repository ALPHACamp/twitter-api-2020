'use strict';
module.exports = (sequelize, DataTypes) => {
  const Tweet = sequelize.define('Tweet', {
    UserId: DataTypes.INTEGER,
    description: DataTypes.TEXT,
    totalLikes: DataTypes.INTEGER,
    totalReplies: DataTypes.INTEGER
  }, {
    tableName: 'Tweets',
    underscored: true
  });
  Tweet.associate = function(models) {
    Tweet.hasMany(models.Reply, { foreignKey: 'tweet_id' })
    Tweet.belongsTo(models.User, { foreignKey: 'user_id' })
    Tweet.belongsToMany(models.User, {
      through: models.Like,
      foreignKey: 'tweet_id',
      as: 'UsersFromLikedTweets'
    })
  };
  return Tweet;
};
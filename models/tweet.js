
'use strict';
module.exports = (sequelize, DataTypes) => {
  const Tweet = sequelize.define('Tweet', {
    UserId: DataTypes.INTEGER,
    description: DataTypes.TEXT
  }, {});
  Tweet.associate = function (models) {
    Tweet.belongsTo(models.User, {
      foreignKey: 'UserId',
      as: 'user'
    })
    Tweet.hasMany(models.Reply, {
      foreignKey: 'TweetId',
      as: 'replies'
    })
    Tweet.hasMany(models.Like, {
      foreignKey: 'TweetId',
      as: 'likes'
    })
    Tweet.belongsToMany(models.User, {
      through: models.Like,
      foreignKey: 'TweetId',
      as: 'likeList'
    })
    Tweet.belongsToMany(models.User, {
      through: models.Reply,
      foreignKey: 'TweetId',
      as: 'replyList'
    })
  };
  return Tweet;
};
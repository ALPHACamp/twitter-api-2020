'use strict';
module.exports = (sequelize, DataTypes) => {
  const Tweet = sequelize.define('Tweet', {
    UserId: DataTypes.INTEGER,
    description: DataTypes.TEXT,
    likeCount: DataTypes.INTEGER,
    replyCount: DataTypes.INTEGER
  }, {});
  Tweet.associate = function(models) {
    Tweet.hasMany(models.Reply)
    Tweet.hasMany(models.Like)
    Tweet.belongsTo(models.User)
  };
  return Tweet;
};
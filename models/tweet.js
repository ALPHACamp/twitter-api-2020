'use strict';
module.exports = (sequelize, DataTypes) => {
  const Tweet = sequelize.define('Tweet', {
  }, {});
  Tweet.associate = function(models) {
    Tweet.hasMany(models.Reply)
    Tweet.hasMany(models.Like)
    Tweet.belongsTo(models.User)
  };
  return Tweet;
};
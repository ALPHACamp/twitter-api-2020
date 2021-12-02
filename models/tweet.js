'use strict';
module.exports = (sequelize, DataTypes) => {
  const Tweet = sequelize.define('Tweet', {
    description: DataTypes.STRING(140),
    UserId: DataTypes.INTEGER
  }, {});
  Tweet.associate = function(models) {
    Tweet.belongsTo(models.User)
    Tweet.hasMany(models.Like)
    Tweet.hasMany(models.Reply)
  };
  return Tweet;
};
'use strict';
module.exports = (sequelize, DataTypes) => {
  const Tweet = sequelize.define('Tweet', {
    UserId: {
      type: DataTypes.INTEGER
    },
    description: {
      type: DataTypes.STRING(140)
    },
    replyCounts: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    likeCounts: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  }, {});
  Tweet.associate = function (models) {
    Tweet.belongsTo(models.User)
    Tweet.hasMany(models.Reply)
    Tweet.hasMany(models.Like)
  };
  return Tweet;
};
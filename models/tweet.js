'use strict'
module.exports = (sequelize, DataTypes) => {
  const Tweet = sequelize.define('Tweet', {
    UserId: {
      type:  DataTypes.INTEGER,
      allowNull: false,
    },
    description: {
      type:  DataTypes.TEXT,
      allowNull: false,
    },
    likeCount: {
      type:  DataTypes.INTEGER,
      defaultValue: 0
    },
    replyCount: {
      type:  DataTypes.INTEGER,
      defaultValue: 0
    }
  }, {})
  Tweet.associate = function (models) {
    Tweet.belongsTo(models.User)
    Tweet.hasMany(models.Reply)
    Tweet.hasMany(models.Like)
  }
  return Tweet
}
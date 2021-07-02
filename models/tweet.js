'use strict'
module.exports = (sequelize, DataTypes) => {
  const Tweet = sequelize.define('Tweet', {
    UserId: DataTypes.INTEGER,
    description: DataTypes.STRING,
  }, {})
  Tweet.associate = function (models) {
    Tweet.hasMany(models.Like)
    Tweet.hasMany(models.Reply)

    Tweet.belongsTo(models.User)
  }
  return Tweet
}
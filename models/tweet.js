'use strict'
module.exports = (sequelize, DataTypes) => {
  const Tweet = sequelize.define('Tweet', {
    UserId: DataTypes.INTEGER,
    description: DataTypes.TEXT,
    likeCount: DataTypes.INTEGER,
    replyCount: DataTypes.INTEGER
  }, {
    tableName: 'Tweets'
  })
  Tweet.associate = function (models) {
  }
  return Tweet
}

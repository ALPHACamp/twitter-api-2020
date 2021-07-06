'use strict';
module.exports = (sequelize, DataTypes) => {
  const Like = sequelize.define('Like', {
    isTweet: DataTypes.BOOLEAN,
    UserId: DataTypes.INTEGER,
    ContentLikedId: DataTypes.INTEGER,
    TweetId: DataTypes.INTEGER,
    ReplyId: DataTypes.INTEGER
  }, {});
  Like.associate = function (models) {
    Like.belongsTo(models.User)
    Like.belongsTo(models.Tweet)
  // Like.belongsTo(models.Reply)
  };
  return Like;
};
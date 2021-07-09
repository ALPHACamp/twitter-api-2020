'use strict';
module.exports = (sequelize, DataTypes) => {
  const Like = sequelize.define('Like', {
    TweetId: DataTypes.INTEGER,
    ReplyId: DataTypes.INTEGER,
    UserId: DataTypes.INTEGER,
  }, {});
  Like.associate = function (models) {
    Like.belongsTo(models.User)
    Like.belongsTo(models.Tweet)
  };
  return Like;
};
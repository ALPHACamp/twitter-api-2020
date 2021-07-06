'use strict';
module.exports = (sequelize, DataTypes) => {
  const Like = sequelize.define('Like', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    isTweet: DataTypes.BOOLEAN,
    ContentLikedId: DataTypes.INTEGER,
    TweetId: DataTypes.INTEGER,
    ReplyId: DataTypes.INTEGER,
    UserId: DataTypes.INTEGER,
  }, {});
  Like.associate = function (models) {
    Like.belongsTo(models.User)
    Like.belongsTo(models.Tweet)
    Like.belongsTo(models.Reply)
  };
  return Like;
};
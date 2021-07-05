'use strict';
module.exports = (sequelize, DataTypes) => {
  const Like = sequelize.define('Like', {
    isTweet: DataTypes.BOOLEAN,
    UserId: DataTypes.INTEGER,
    ContentLikedId: DataTypes.INTEGER
  }, {});
  Like.associate = function (models) {
    Like.belongsTo(models.User)
    Like.belongsTo(models.Tweet)
  };
  return Like;
};
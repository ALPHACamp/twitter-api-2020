'use strict';
module.exports = (sequelize, DataTypes) => {
  const Like = sequelize.define('Like', {
    UserId: DataTypes.INTEGER,
    TweetId: DataTypes.INTEGER
  }, {});
  Like.associate = function(models) {
    Like.belongsTo(models.User, { foreignKey: 'userId' })
    Like.belongsTo(models.Tweet, { foreignKey: 'tweetId' })
  };
  return Like;
};
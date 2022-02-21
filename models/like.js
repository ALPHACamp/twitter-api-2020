'use strict';
module.exports = (sequelize, DataTypes) => {
  const Like = sequelize.define('Like', {
    UserId: DataTypes.INTEGER,
    TweetId: DataTypes.INTEGER
  }, {
    tableName: 'Likes',
    underscored: true
  });
  Like.associate = function(models) {
  };
  return Like;
};